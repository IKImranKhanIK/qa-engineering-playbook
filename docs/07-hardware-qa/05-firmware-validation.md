# Firmware Validation

## Overview

Firmware is the low-level software that controls hardware devices. Firmware validation ensures embedded systems operate reliably, safely, and meet specifications. Unlike software that can be patched easily, firmware bugs in deployed hardware are expensive to fix.

## Why Firmware Validation is Critical

### Real-World Incidents

**Therac-25 Radiation Therapy Machine (1985-1987)**
- Issue: Firmware race condition caused massive radiation overdoses
- Impact: 6 patients killed or injured
- Root cause: Inadequate firmware testing and safety validation
- **Lesson:** Firmware bugs can kill

**Toyota Unintended Acceleration (2009-2010)**
- Issue: Firmware bugs caused vehicles to accelerate uncontrollably
- Impact: 89 deaths, millions of vehicles recalled
- Root cause: Buffer overflows, task priority issues, inadequate testing
- **Lesson:** Real-time firmware requires rigorous validation

**Medical Device Recalls (Ongoing)**
- Firmware updates bricking devices
- Security vulnerabilities in outdated firmware
- **Lesson:** Firmware is a long-term quality commitment

---

## Firmware vs Software Testing Differences

| Aspect | Desktop/Web Software | Firmware |
|--------|---------------------|----------|
| **Hardware dependency** | Abstract, OS-managed | Direct hardware control |
| **Real-time requirements** | Soft real-time | Hard real-time (must meet deadlines) |
| **Resource constraints** | Abundant RAM/CPU | Limited RAM (KB), slow CPU |
| **Update mechanism** | Easy OTA updates | Difficult, risky updates |
| **Failure impact** | Crash, restart | Device bricked, safety hazard |
| **Testing difficulty** | Easy to debug | Hardware-dependent, hard to debug |

---

## Firmware Development Lifecycle

```
Requirements → Design → Implementation → Unit Test → Integration Test → System Test → Validation → Release
      │           │            │             │              │               │             │          │
      │           │            │             │              │               │             │          │
      └───────────┴────────────┴─────────────┴──────────────┴───────────────┴─────────────┴──────────┘
                                        Quality Gates Throughout
```

---

## Firmware Testing Types

### 1. Unit Testing

Test individual firmware modules in isolation.

**Example: Temperature Sensor Driver**

```c
// temperature.c
int16_t read_temperature_celsius() {
    uint16_t raw_adc = adc_read_channel(TEMP_SENSOR_CHANNEL);
    // Convert ADC value to Celsius
    // Formula: Temp = (raw_adc * 3.3 / 4096 - 0.5) / 0.01
    int16_t temp_celsius = ((raw_adc * 33 / 4096) - 5) / 1;
    return temp_celsius;
}
```

**Unit Test (Native C, not on hardware):**

```c
// test_temperature.c
#include "unity.h"  // Unit test framework

// Mock ADC function
uint16_t mock_adc_value = 0;
uint16_t adc_read_channel(uint8_t channel) {
    return mock_adc_value;
}

void test_temperature_conversion_zero_degrees() {
    mock_adc_value = 620;  // Should read as 0°C
    TEST_ASSERT_EQUAL_INT16(0, read_temperature_celsius());
}

void test_temperature_conversion_25_degrees() {
    mock_adc_value = 930;  // Should read as 25°C
    TEST_ASSERT_EQUAL_INT16(25, read_temperature_celsius());
}

void test_temperature_conversion_negative() {
    mock_adc_value = 310;  // Should read as -25°C
    TEST_ASSERT_EQUAL_INT16(-25, read_temperature_celsius());
}

int main() {
    UNITY_BEGIN();
    RUN_TEST(test_temperature_conversion_zero_degrees);
    RUN_TEST(test_temperature_conversion_25_degrees);
    RUN_TEST(test_temperature_conversion_negative);
    return UNITY_END();
}
```

**Benefits:**
- Fast (runs on development machine)
- No hardware needed
- Easy to debug
- Catches logic errors early

### 2. Hardware-in-the-Loop (HIL) Testing

Test firmware on actual hardware with automated test equipment.

**Setup for Smart Thermostat:**

```
Test PC
   │
   ├── UART (for logging and commands)
   ├── I2C (sensor simulation)
   ├── GPIO (button simulation)
   ├── Power Supply (controlled voltage)
   └── Oscilloscope (timing verification)
        │
   Device Under Test (DUT)
```

**Automated HIL Test:**

```python
# test_thermostat_hil.py
import serial
import time

class ThermostatTester:
    def __init__(self, port):
        self.serial = serial.Serial(port, 115200)
        self.i2c_sim = I2CSimulator()  # Simulates I2C sensors

    def set_temperature_sensor(self, temp_celsius):
        """Simulate temperature sensor reading"""
        self.i2c_sim.set_temp_sensor(temp_celsius)

    def press_button(self, button_name):
        """Simulate button press via GPIO"""
        self.gpio.set_pin(button_name, LOW)
        time.sleep(0.1)  # 100ms press
        self.gpio.set_pin(button_name, HIGH)

    def read_display(self):
        """Read what's shown on display via I2C"""
        return self.i2c_sim.read_display()

    def test_heating_activation(self):
        """Test: When temp drops below setpoint, heating activates"""
        # Set setpoint to 22°C
        self.send_command("SET_TEMP 22")

        # Simulate temp drop to 20°C
        self.set_temperature_sensor(20)
        time.sleep(1)  # Wait for firmware to react

        # Check heating relay activated
        heating_status = self.read_relay_status("HEATING")
        assert heating_status == "ON", "Heating should activate when temp < setpoint"

    def test_overheat_protection(self):
        """Test: Heating shuts off if temp exceeds safe limit"""
        self.send_command("SET_TEMP 25")
        self.set_temperature_sensor(25)
        time.sleep(1)

        # Simulate sensor failure: reports 95°C (dangerous!)
        self.set_temperature_sensor(95)
        time.sleep(0.5)

        # Heating should immediately shut off
        heating_status = self.read_relay_status("HEATING")
        assert heating_status == "OFF", "Overheat protection failed!"

        # Error should be displayed
        display = self.read_display()
        assert "ERROR" in display or "OVERHEAT" in display

# Run tests
tester = ThermostatTester("/dev/ttyUSB0")
tester.test_heating_activation()
tester.test_overheat_protection()
print("All tests passed ✅")
```

### 3. Timing and Real-Time Testing

Verify firmware meets real-time deadlines.

**Example: Interrupt Response Time**

```c
// Critical: Emergency stop button must stop motor within 10ms

// Interrupt handler
void emergency_stop_isr() {
    // Time-critical code
    motor_disable();
    set_brake();
    error_flag = true;
}

// Test: Measure interrupt response time
```

**Test with Oscilloscope:**

```
Setup:
1. Connect oscilloscope to emergency stop button (Ch1)
2. Connect oscilloscope to motor enable signal (Ch2)
3. Press emergency stop button
4. Measure time from button press to motor disable

Results:
- Button press (Ch1 falling edge)
- Motor disable (Ch2 falling edge)
- Measured delay: 2.3 ms ✅ (< 10ms requirement)

Test Cases:
- Normal operation: 2.3 ms ✅
- Max CPU load: 4.1 ms ✅
- During UART transmission: 3.8 ms ✅
- During EEPROM write: 8.2 ms ✅
- All under 10ms requirement ✅
```

### 4. Stress Testing

Test firmware under extreme conditions.

**CPU Load Stress Test:**

```c
// Stress test: Max CPU load
void stress_test_cpu_load() {
    // Simulate maximum computational load
    while (1) {
        // Complex calculations
        float result = compute_fft_1024_points();

        // Critical interrupts should still work
        if (emergency_stop_pressed) {
            // Should still respond within 10ms
            motor_stop();
        }

        // Display should still update
        update_display();
    }
}

// Test: Verify system still responsive under max load
Results:
- Emergency stop response: 8.9 ms ✅
- Display update rate: 10 FPS ✅
- UART communication: No data loss ✅
```

**Memory Stress Test:**

```c
// Test: Memory allocation/deallocation doesn't leak
void test_memory_leak() {
    uint32_t initial_free_memory = get_free_heap();

    for (int i = 0; i < 1000; i++) {
        // Allocate buffer
        uint8_t* buffer = malloc(1024);

        // Use buffer
        process_data(buffer);

        // Free buffer
        free(buffer);
    }

    uint32_t final_free_memory = get_free_heap();

    // Free memory should be same (no leak)
    assert(final_free_memory == initial_free_memory);
}

Results:
- Initial free memory: 12,384 bytes
- After 1,000 iterations: 12,384 bytes ✅
- No memory leak detected
```

### 5. Peripheral Testing

Test firmware's interaction with hardware peripherals.

**UART Communication Test:**

```python
# test_uart.py
def test_uart_loopback():
    """Test UART TX and RX work correctly"""
    test_data = b"Hello, Firmware!"

    # Send data
    uart.write(test_data)
    time.sleep(0.1)

    # Read back (assuming loopback mode enabled)
    received = uart.read(len(test_data))

    assert received == test_data, f"UART error: sent {test_data}, received {received}"

def test_uart_baudrate():
    """Test UART works at specified baud rate"""
    baud_rates = [9600, 115200, 921600]

    for baud in baud_rates:
        uart.baudrate = baud
        uart.write(b"TEST")
        received = uart.read(4)
        assert received == b"TEST", f"UART failed at {baud} baud"

def test_uart_buffer_overflow():
    """Test UART handles buffer overflow gracefully"""
    # Send more data than buffer can hold (usually 256 bytes)
    large_data = b"A" * 1024
    uart.write(large_data)

    # Firmware should not crash, should report overflow
    status = uart.read_line()
    assert "OVERFLOW" in status or "ERROR" in status
```

**I2C Sensor Communication Test:**

```python
def test_i2c_sensor_read():
    """Test reading temperature sensor via I2C"""
    # Read temperature from sensor at address 0x48
    temp_data = i2c.read_register(0x48, 0x00, 2)  # Read 2 bytes from reg 0x00

    temp_celsius = (temp_data[0] << 8 | temp_data[1]) * 0.0625  # Conversion

    # Sanity check: Temperature should be reasonable (room temp)
    assert 15 < temp_celsius < 35, f"Unreasonable temp: {temp_celsius}°C"
    print(f"Temperature: {temp_celsius}°C ✅")

def test_i2c_error_handling():
    """Test I2C handles missing sensor gracefully"""
    # Try to read from non-existent device
    try:
        data = i2c.read_register(0x99, 0x00, 1)  # Invalid address
    except I2CError as e:
        print("I2C error handled correctly ✅")
        return

    assert False, "I2C should have raised error for invalid address"
```

---

## Firmware Security Testing

### Buffer Overflow Testing

```c
// Vulnerable code
void process_command(char* input) {
    char buffer[64];
    strcpy(buffer, input);  // ❌ No bounds checking!
    // Process command...
}

// Attack: Send 100-byte input, overwrite stack
```

**Security Test:**

```python
def test_buffer_overflow_protection():
    """Test firmware doesn't crash on oversized input"""
    # Send intentionally oversized command
    malicious_input = "A" * 200

    uart.write(malicious_input.encode())
    time.sleep(0.5)

    # Firmware should reject input, not crash
    response = uart.read_line()
    assert response != b"", "Firmware crashed (no response)"
    assert b"ERROR" in response or b"INVALID" in response
    print("Buffer overflow protection works ✅")
```

### Authentication Testing

```python
def test_firmware_authentication():
    """Test firmware validates commands with authentication"""
    # Try to execute privileged command without auth
    uart.write(b"FACTORY_RESET\n")
    response = uart.read_line()
    assert b"UNAUTHORIZED" in response or b"AUTH_REQUIRED" in response

    # Authenticate
    uart.write(b"AUTH " + AUTH_TOKEN + b"\n")
    time.sleep(0.1)

    # Now privileged command should work
    uart.write(b"FACTORY_RESET\n")
    response = uart.read_line()
    assert b"RESET_OK" in response
```

---

## Firmware Update Testing

### OTA (Over-The-Air) Update Testing

```
Test Plan: Firmware OTA Update

Scenarios to Test:
1. Successful update (happy path)
2. Update interrupted (power loss mid-update)
3. Corrupted firmware image
4. Wrong firmware version
5. Insufficient battery
6. Network interruption
```

**Test: Power Loss During Update**

```python
def test_update_power_loss():
    """Test device recovers from power loss during update"""
    # Start firmware update
    start_firmware_update("firmware_v2.bin")

    # Wait until 50% progress
    wait_for_update_progress(50)

    # Simulate power loss
    power_supply.set_voltage(0)
    time.sleep(2)

    # Restore power
    power_supply.set_voltage(3.7)
    time.sleep(5)

    # Device should boot with old firmware (rollback)
    version = get_firmware_version()
    assert version == "v1.0", "Device should rollback to previous firmware"

    # Device should still be functional
    assert device_functional(), "Device should be operational after failed update"
```

**Test: Corrupted Firmware Image**

```python
def test_corrupted_firmware_rejection():
    """Test device rejects corrupted firmware"""
    # Create corrupted firmware (flip some bits)
    with open("firmware_v2.bin", "rb") as f:
        firmware_data = bytearray(f.read())

    # Corrupt bytes 1000-1010
    for i in range(1000, 1010):
        firmware_data[i] ^= 0xFF

    # Try to update with corrupted firmware
    result = upload_firmware(firmware_data)

    assert result == "CHECKSUM_ERROR" or result == "SIGNATURE_INVALID"

    # Device should still run old firmware
    version = get_firmware_version()
    assert version == "v1.0"
```

---

## Watchdog Timer Testing

```c
// Watchdog ensures firmware doesn't hang
void main() {
    watchdog_init(5000);  // 5 second timeout

    while (1) {
        watchdog_reset();  // Pet the watchdog

        // Normal operation
        do_work();

        // If firmware hangs here, watchdog resets device after 5s
    }
}
```

**Test: Watchdog Recovery**

```python
def test_watchdog_recovery():
    """Test watchdog resets device if firmware hangs"""
    # Send command that causes firmware to hang
    uart.write(b"HANG\n")  # Test command that infinite loops

    # Firmware should reset via watchdog within 6 seconds
    time.sleep(6)

    # Check if device rebooted
    boot_message = uart.read_line()
    assert b"BOOT" in boot_message or b"RESET" in boot_message

    # Device should be functional after watchdog reset
    uart.write(b"PING\n")
    response = uart.read_line()
    assert response == b"PONG\n"
    print("Watchdog recovery works ✅")
```

---

## Power Management Testing

### Sleep Mode Testing

```python
def test_sleep_mode_current():
    """Test device enters low-power sleep mode correctly"""
    # Put device in sleep mode
    uart.write(b"SLEEP\n")
    time.sleep(1)

    # Measure current draw
    current_ua = power_supply.measure_current_microamps()

    # Should be < 50 µA in sleep
    assert current_ua < 50, f"Sleep current too high: {current_ua} µA"
    print(f"Sleep current: {current_ua} µA ✅")

    # Wake device (button press or timer)
    wake_device()
    time.sleep(0.5)

    # Verify device responsive
    uart.write(b"PING\n")
    response = uart.read_line()
    assert response == b"PONG\n"
```

### Brown-out Testing

```python
def test_brownout_detection():
    """Test device handles low voltage gracefully"""
    # Normal voltage
    power_supply.set_voltage(3.7)
    time.sleep(1)
    assert device_functional()

    # Drop voltage to brownout threshold (e.g., 2.7V)
    power_supply.set_voltage(2.7)
    time.sleep(0.5)

    # Device should enter brownout protection mode
    # (saves state, shuts down gracefully)
    status = get_device_status()
    assert "BROWNOUT" in status or "LOW_BATTERY" in status

    # Restore voltage
    power_supply.set_voltage(3.7)
    time.sleep(1)

    # Device should recover
    assert device_functional()
```

---

## Compatibility Testing

### Bootloader Compatibility

```
Test: New firmware works with old bootloader

Scenario: User has device with bootloader v1.0
New firmware: v2.5

Test:
1. Flash bootloader v1.0
2. Update firmware to v2.5 via OTA
3. Verify device boots correctly
4. Verify all functions work

Result: ✅ Pass (backward compatible)
```

### Hardware Revision Compatibility

```python
def test_hardware_compatibility():
    """Test firmware detects hardware version and adapts"""
    # Read hardware revision from EEPROM
    hw_rev = read_hardware_revision()

    if hw_rev == "A":
        # Hardware revision A has temperature sensor on I2C addr 0x48
        expected_temp_addr = 0x48
    elif hw_rev == "B":
        # Hardware revision B moved sensor to 0x49
        expected_temp_addr = 0x49
    else:
        assert False, f"Unknown hardware revision: {hw_rev}"

    # Verify firmware uses correct address
    temp = read_temperature_sensor()
    assert temp is not None, "Firmware not compatible with this hardware"
    print(f"Hardware {hw_rev} compatibility ✅")
```

---

## Regulatory Compliance Testing

### EMC (Electromagnetic Compatibility)

```
Test: Firmware must not cause excessive radio emissions

Method:
1. Run firmware in "worst case" mode (all peripherals active)
2. Measure radiated emissions in anechoic chamber
3. Verify < FCC Part 15 limits

Firmware Considerations:
- Clock spreading (reduce peak emissions)
- Peripheral enable/disable timing
- PWM frequency selection

Results:
- Max emission: -12 dBm @ 250 MHz
- FCC limit: -10 dBm
- Margin: 2 dB ⚠️ (barely passes)
- Action: Enable clock spreading in firmware
- Retest: -15 dBm ✅ (5 dB margin)
```

### Medical Device Software Validation (IEC 62304)

```
Requirements for Class B Medical Device Firmware:

1. Software Safety Classification: Class B
2. Requirements Traceability: All requirements traced to tests
3. Risk Management: FMEA for firmware
4. Architecture Documentation: Design specs
5. Unit Testing: 100% coverage of safety-critical code
6. Integration Testing: All interfaces tested
7. System Testing: All requirements verified
8. Regression Testing: After every change
9. Known Anomalies List: All known bugs documented
10. Release Documentation: Version control, release notes

Validation Evidence:
✅ 127 requirements
✅ 412 test cases
✅ 100% safety-critical code covered
✅ Traceability matrix complete
✅ Independent V&V performed
✅ Regulatory submission ready
```

---

## Best Practices

### 1. Test on Actual Hardware Early

```
❌ Bad: Test only in simulator until just before release
Result: Hardware-specific bugs found late

✅ Good: Run on hardware from day 1
Result: Hardware issues found early
```

### 2. Automate Regression Testing

```
Every firmware build should automatically:
- Compile successfully
- Pass unit tests (on PC)
- Flash to hardware
- Run HIL tests
- Generate test report

No manual testing for regression.
```

### 3. Version Control Everything

```
Track in Git:
- Source code
- Build scripts
- Test scripts
- Test results
- Hardware schematics
- BOM (Bill of Materials)

Every release: Git tag with version number
```

### 4. Test Failure Modes

```
Don't just test happy path:
- Sensor disconnected
- Communication timeouts
- Memory corruption
- Power glitches
- Extreme temperatures
```

---

## What Senior Engineers Know

**Firmware bugs are expensive.** Fixing in field requires physical recall or complex OTA updates. Test thoroughly upfront.

**Real-time is hard.** Timing bugs only appear under specific conditions. Use oscilloscope, logic analyzer.

**Hardware variability matters.** One unit works, another fails. Test multiple units from different production lots.

**Security is critical.** IoT devices are hacked daily. Buffer overflows, weak crypto, backdoors all exploited.

**Update mechanism is part of the product.** If you can't safely update firmware in field, you can't fix bugs.

---

## Exercise

**Design Firmware Test Plan:**

Product: Smart Door Lock (Battery-powered, BLE connectivity)

Firmware Functions:
- BLE communication with smartphone app
- Motor control (lock/unlock)
- Battery monitoring
- Sleep mode (< 100 µA)
- Secure authentication
- OTA firmware update

**Your Task:**

1. List all test types needed (unit, HIL, stress, security)
2. Design specific test cases (at least 10)
3. Define pass/fail criteria
4. Identify critical timing requirements
5. Plan for OTA update testing

**Deliverable:** Comprehensive firmware test plan

---

## Next Steps

- Learn [Supplier Quality Management](06-supplier-quality.md)
- Master [Failure Analysis](07-failure-analysis.md)
- Study [8D and CAPA Process](08-8d-capa-process.md)
- Review [Power and Battery Testing](04-power-battery-testing.md)
