# Lab: API Testing with Real APIs

**Difficulty:** Intermediate
**Duration:** 3-4 hours
**Category:** Automation

## Objectives

By the end of this lab, you will:
- Test a real REST API using multiple tools
- Validate responses with assertions
- Handle authentication
- Test error scenarios
- Automate API tests
- Generate test reports

## Prerequisites

- Basic understanding of HTTP and REST
- Completed [API Testing lesson](../../docs/02-software-qa/02-api-testing.md)
- Programming knowledge (Python or JavaScript)

## Setup

### Tools Needed

**Option 1: Python**
```bash
pip install requests pytest
```

**Option 2: JavaScript/Node.js**
```bash
npm install axios jest supertest
```

**Option 3: Postman** (GUI)
- Download from https://postman.com

### Test API

We'll use JSONPlaceholder (https://jsonplaceholder.typicode.com), a free fake REST API.

**Available Endpoints:**
- `/posts` - Blog posts
- `/users` - Users
- `/comments` - Comments
- `/albums` - Albums
- `/photos` - Photos

**Base URL:** `https://jsonplaceholder.typicode.com`

## Part 1: Manual API Testing with Postman

### Exercise 1.1: Basic GET Request

**Task:** Retrieve all posts

1. Open Postman
2. Create new request
3. Method: GET
4. URL: `https://jsonplaceholder.typicode.com/posts`
5. Click "Send"

**Verify:**
- Status code: 200
- Response is array
- Array contains 100 posts
- Each post has: id, userId, title, body

**Document:** Take screenshot of response

### Exercise 1.2: GET Single Resource

**Task:** Get post with ID 1

**Request:**
- Method: GET
- URL: `https://jsonplaceholder.typicode.com/posts/1`

**Expected Response:**
```json
{
  "userId": 1,
  "id": 1,
  "title": "...",
  "body": "..."
}
```

**Verify:**
- Status code: 200
- Response contains all fields
- id matches requested ID

### Exercise 1.3: POST Request (Create)

**Task:** Create a new post

**Request:**
- Method: POST
- URL: `https://jsonplaceholder.typicode.com/posts`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "title": "My Test Post",
  "body": "This is a test post created during QA lab",
  "userId": 1
}
```

**Verify:**
- Status code: 201 (Created)
- Response contains new ID
- Response includes submitted data

### Exercise 1.4: PUT Request (Update)

**Task:** Update post 1

**Request:**
- Method: PUT
- URL: `https://jsonplaceholder.typicode.com/posts/1`
- Body:
```json
{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated body content",
  "userId": 1
}
```

**Verify:**
- Status code: 200
- Response reflects changes

### Exercise 1.5: DELETE Request

**Task:** Delete post 1

**Request:**
- Method: DELETE
- URL: `https://jsonplaceholder.typicode.com/posts/1`

**Verify:**
- Status code: 200

### Exercise 1.6: Test Postman Assertions

In Postman, add tests (Tests tab):

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

pm.test("Response has expected structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('title');
    pm.expect(jsonData).to.have.property('body');
    pm.expect(jsonData).to.have.property('userId');
});

pm.test("ID is correct type", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.be.a('number');
});
```

**Run and verify:** All tests pass

### Exercise 1.7: Query Parameters

**Task:** Get posts by user

**Request:**
- Method: GET
- URL: `https://jsonplaceholder.typicode.com/posts?userId=1`

**Verify:**
- All posts have userId = 1
- Multiple posts returned

### Exercise 1.8: Nested Resources

**Task:** Get comments for post 1

**Request:**
- Method: GET
- URL: `https://jsonplaceholder.typicode.com/posts/1/comments`

**Verify:**
- Returns array of comments
- All comments have postId = 1

## Part 2: Automated API Testing (Python)

### Exercise 2.1: Setup Test Project

**Create project structure:**
```
api-tests/
├── tests/
│   ├── __init__.py
│   ├── test_posts.py
│   └── test_users.py
├── conftest.py
└── requirements.txt
```

**requirements.txt:**
```
requests==2.31.0
pytest==7.4.0
pytest-html==3.2.0
```

**Install:**
```bash
pip install -r requirements.txt
```

### Exercise 2.2: Write Basic Test

**tests/test_posts.py:**
```python
import requests
import pytest

BASE_URL = "https://jsonplaceholder.typicode.com"

def test_get_all_posts():
    """Test retrieving all posts"""
    response = requests.get(f"{BASE_URL}/posts")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) == 100

def test_get_single_post():
    """Test retrieving a single post"""
    post_id = 1
    response = requests.get(f"{BASE_URL}/posts/{post_id}")

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == post_id
    assert "title" in data
    assert "body" in data
    assert "userId" in data

def test_get_nonexistent_post():
    """Test 404 for non-existent post"""
    response = requests.get(f"{BASE_URL}/posts/99999")

    assert response.status_code == 404
```

**Run tests:**
```bash
pytest tests/test_posts.py -v
```

**Expected:** All tests pass

### Exercise 2.3: Test POST Requests

**Add to test_posts.py:**
```python
def test_create_post():
    """Test creating a new post"""
    new_post = {
        "title": "Test Post from Automated Test",
        "body": "This post was created by pytest",
        "userId": 1
    }

    response = requests.post(f"{BASE_URL}/posts", json=new_post)

    assert response.status_code == 201

    data = response.json()
    assert "id" in data
    assert data["title"] == new_post["title"]
    assert data["body"] == new_post["body"]
    assert data["userId"] == new_post["userId"]

def test_create_post_missing_required_field():
    """Test validation error when required field missing"""
    invalid_post = {
        "title": "Test Post",
        # Missing body and userId
    }

    response = requests.post(f"{BASE_URL}/posts", json=invalid_post)

    # Note: JSONPlaceholder doesn't actually validate, but in real API:
    # assert response.status_code == 400
```

### Exercise 2.4: Test PUT Requests

```python
def test_update_post():
    """Test updating an existing post"""
    post_id = 1
    updated_post = {
        "id": post_id,
        "title": "Updated Title",
        "body": "Updated body content",
        "userId": 1
    }

    response = requests.put(f"{BASE_URL}/posts/{post_id}", json=updated_post)

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == post_id
    assert data["title"] == updated_post["title"]
    assert data["body"] == updated_post["body"]
```

### Exercise 2.5: Test DELETE Requests

```python
def test_delete_post():
    """Test deleting a post"""
    post_id = 1

    response = requests.delete(f"{BASE_URL}/posts/{post_id}")

    assert response.status_code == 200
```

### Exercise 2.6: Test Query Parameters

```python
def test_get_posts_by_user():
    """Test filtering posts by userId"""
    user_id = 1

    response = requests.get(f"{BASE_URL}/posts", params={"userId": user_id})

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

    # Verify all posts belong to specified user
    for post in data:
        assert post["userId"] == user_id
```

### Exercise 2.7: Test Response Schema

```python
def test_post_response_schema():
    """Test post response has expected structure"""
    response = requests.get(f"{BASE_URL}/posts/1")

    assert response.status_code == 200

    data = response.json()

    # Check required fields exist
    required_fields = ["id", "userId", "title", "body"]
    for field in required_fields:
        assert field in data, f"Missing required field: {field}"

    # Check field types
    assert isinstance(data["id"], int)
    assert isinstance(data["userId"], int)
    assert isinstance(data["title"], str)
    assert isinstance(data["body"], str)
```

### Exercise 2.8: Test Nested Resources

```python
def test_get_post_comments():
    """Test getting comments for a specific post"""
    post_id = 1

    response = requests.get(f"{BASE_URL}/posts/{post_id}/comments")

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

    # Verify all comments belong to the post
    for comment in data:
        assert comment["postId"] == post_id
        assert "id" in comment
        assert "name" in comment
        assert "email" in comment
        assert "body" in comment
```

### Exercise 2.9: Test Pagination (if supported)

```python
def test_pagination():
    """Test API pagination"""
    # Get first page
    response_page1 = requests.get(f"{BASE_URL}/posts", params={"_page": 1, "_limit": 10})
    # Get second page
    response_page2 = requests.get(f"{BASE_URL}/posts", params={"_page": 2, "_limit": 10})

    assert response_page1.status_code == 200
    assert response_page2.status_code == 200

    data_page1 = response_page1.json()
    data_page2 = response_page2.json()

    assert len(data_page1) == 10
    assert len(data_page2) == 10

    # Verify pages contain different data
    ids_page1 = [post["id"] for post in data_page1]
    ids_page2 = [post["id"] for post in data_page2]

    assert set(ids_page1).isdisjoint(set(ids_page2)), "Pages should not overlap"
```

### Exercise 2.10: Performance Testing

```python
import time

def test_api_response_time():
    """Test API responds within acceptable time"""
    start_time = time.time()

    response = requests.get(f"{BASE_URL}/posts")

    end_time = time.time()
    response_time = end_time - start_time

    assert response.status_code == 200
    assert response_time < 2.0, f"Response too slow: {response_time}s"

def test_concurrent_requests():
    """Test handling multiple concurrent requests"""
    import concurrent.futures

    def make_request(post_id):
        return requests.get(f"{BASE_URL}/posts/{post_id}")

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request, i) for i in range(1, 11)]
        responses = [f.result() for f in concurrent.futures.as_completed(futures)]

    # All requests should succeed
    assert all(r.status_code == 200 for r in responses)
```

## Part 3: Advanced Scenarios

### Exercise 3.1: Setup Fixtures

**conftest.py:**
```python
import pytest
import requests

@pytest.fixture
def api_base_url():
    return "https://jsonplaceholder.typicode.com"

@pytest.fixture
def test_post(api_base_url):
    """Create a test post and clean up after"""
    # Setup: Create test post
    new_post = {
        "title": "Test Post for Fixture",
        "body": "This is a test post",
        "userId": 1
    }
    response = requests.post(f"{api_base_url}/posts", json=new_post)
    post = response.json()

    yield post

    # Teardown: Delete test post (if API supported)
    # requests.delete(f"{api_base_url}/posts/{post['id']}")
```

**Use fixture:**
```python
def test_using_fixture(api_base_url, test_post):
    """Test using fixture data"""
    response = requests.get(f"{api_base_url}/posts/{test_post['id']}")

    assert response.status_code == 200
    # Note: JSONPlaceholder doesn't persist, so this might not work
```

### Exercise 3.2: Parameterized Tests

```python
@pytest.mark.parametrize("post_id,expected_user_id", [
    (1, 1),
    (2, 1),
    (11, 2),
    (21, 3),
])
def test_post_belongs_to_user(api_base_url, post_id, expected_user_id):
    """Test posts belong to correct users"""
    response = requests.get(f"{api_base_url}/posts/{post_id}")

    assert response.status_code == 200
    assert response.json()["userId"] == expected_user_id
```

### Exercise 3.3: Generate HTML Report

**Run with HTML report:**
```bash
pytest tests/ --html=report.html --self-contained-html
```

**Open report.html** in browser to see results

## Part 4: Real API Authentication (Optional)

### Exercise 4.1: Test with GitHub API

**Get Personal Access Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Copy token

**Test authenticated request:**
```python
import os

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def test_github_authenticated_request():
    """Test GitHub API with authentication"""
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    response = requests.get("https://api.github.com/user", headers=headers)

    assert response.status_code == 200
    assert "login" in response.json()

def test_github_unauthenticated_request():
    """Test GitHub API without authentication"""
    response = requests.get("https://api.github.com/user")

    assert response.status_code == 401
```

**Run:**
```bash
export GITHUB_TOKEN=your_token_here
pytest tests/test_github.py -v
```

## Evaluation Criteria

### Basic (Must Complete)
- [ ] Successfully made GET, POST, PUT, DELETE requests
- [ ] Verified response status codes
- [ ] Validated response body structure
- [ ] Tested error scenarios (404)
- [ ] Wrote at least 10 automated tests
- [ ] All tests pass

### Intermediate (Should Complete)
- [ ] Used fixtures for test setup
- [ ] Tested query parameters
- [ ] Tested nested resources
- [ ] Validated response schemas
- [ ] Parameterized tests
- [ ] Generated HTML test report

### Advanced (Bonus)
- [ ] Performance testing (response time)
- [ ] Concurrent request testing
- [ ] Authenticated API testing
- [ ] Custom assertions/helpers
- [ ] Test data management strategy

## Deliverables

1. **Postman Collection** - Export and save
2. **Automated Test Suite** - Complete Python/JS test files
3. **Test Report** - HTML report from pytest
4. **Documentation** - README explaining how to run tests

## Troubleshooting

**Issue: Tests fail with connection error**
- Check internet connection
- Verify API URL is correct
- Try in browser first

**Issue: Pytest not found**
- Ensure pip install completed
- Check Python version (3.7+)
- Use `python -m pytest` instead of `pytest`

**Issue: Import errors**
- Verify all dependencies installed
- Check file structure matches example
- Ensure `__init__.py` exists in tests/

## Next Steps

After completing this lab:
1. Try testing a real API from your project
2. Add CI/CD integration (GitHub Actions)
3. Explore contract testing with Pact
4. Learn GraphQL API testing
5. Practice with other public APIs:
   - https://reqres.in
   - https://httpbin.org
   - https://dog.ceo/dog-api

## Resources

- [JSONPlaceholder Guide](https://jsonplaceholder.typicode.com/guide/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Requests Library](https://requests.readthedocs.io/)
- [REST API Testing Best Practices](../../docs/02-software-qa/02-api-testing.md)

---

**Completed this lab? Mark it complete in your progress tracker!**
