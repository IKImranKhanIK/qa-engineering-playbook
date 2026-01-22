"""
Sample API Test Suite
======================

This is a complete, working example of API tests using pytest and requests.
You can copy this file and adapt it for your own APIs.

To run:
    pip install requests pytest
    pytest api-test-example.py -v

Features demonstrated:
- GET, POST, PUT, DELETE requests
- Response validation
- Error handling
- Query parameters
- Fixtures for setup/teardown
- Parametrized tests
- Performance testing
"""

import requests
import pytest
import time
from typing import Dict, Any

# Configuration
BASE_URL = "https://jsonplaceholder.typicode.com"
TIMEOUT = 10  # seconds


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def api_client():
    """Provides configured API client"""
    class APIClient:
        def __init__(self, base_url):
            self.base_url = base_url
            self.session = requests.Session()
            self.session.headers.update({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })

        def get(self, endpoint, **kwargs):
            url = f"{self.base_url}/{endpoint}"
            return self.session.get(url, timeout=TIMEOUT, **kwargs)

        def post(self, endpoint, **kwargs):
            url = f"{self.base_url}/{endpoint}"
            return self.session.post(url, timeout=TIMEOUT, **kwargs)

        def put(self, endpoint, **kwargs):
            url = f"{self.base_url}/{endpoint}"
            return self.session.put(url, timeout=TIMEOUT, **kwargs)

        def delete(self, endpoint, **kwargs):
            url = f"{self.base_url}/{endpoint}"
            return self.session.delete(url, timeout=TIMEOUT, **kwargs)

    return APIClient(BASE_URL)


@pytest.fixture
def sample_post() -> Dict[str, Any]:
    """Provides sample post data for testing"""
    return {
        "title": "Test Post from Automated Suite",
        "body": "This is a comprehensive test of the API",
        "userId": 1
    }


# ============================================================================
# GET REQUEST TESTS
# ============================================================================

class TestGetRequests:
    """Test suite for GET endpoints"""

    def test_get_all_posts(self, api_client):
        """Verify we can retrieve all posts"""
        response = api_client.get("posts")

        assert response.status_code == 200, "Expected 200 OK"
        assert response.headers["Content-Type"] == "application/json; charset=utf-8"

        posts = response.json()
        assert isinstance(posts, list), "Response should be a list"
        assert len(posts) == 100, "Should return 100 posts"

    def test_get_single_post(self, api_client):
        """Verify we can retrieve a specific post"""
        post_id = 1
        response = api_client.get(f"posts/{post_id}")

        assert response.status_code == 200

        post = response.json()
        assert post["id"] == post_id
        assert "title" in post
        assert "body" in post
        assert "userId" in post

    def test_get_nonexistent_post(self, api_client):
        """Verify 404 is returned for non-existent resource"""
        response = api_client.get("posts/99999")

        assert response.status_code == 404

    def test_get_posts_with_query_params(self, api_client):
        """Verify query parameter filtering works"""
        user_id = 1
        response = api_client.get("posts", params={"userId": user_id})

        assert response.status_code == 200

        posts = response.json()
        assert len(posts) > 0, "Should return at least one post"

        for post in posts:
            assert post["userId"] == user_id, f"Post {post['id']} has wrong userId"

    def test_get_nested_resource(self, api_client):
        """Verify we can get comments for a post"""
        post_id = 1
        response = api_client.get(f"posts/{post_id}/comments")

        assert response.status_code == 200

        comments = response.json()
        assert isinstance(comments, list)
        assert len(comments) > 0

        for comment in comments:
            assert comment["postId"] == post_id
            assert "id" in comment
            assert "name" in comment
            assert "email" in comment
            assert "body" in comment


# ============================================================================
# POST REQUEST TESTS
# ============================================================================

class TestPostRequests:
    """Test suite for POST (create) endpoints"""

    def test_create_post(self, api_client, sample_post):
        """Verify we can create a new post"""
        response = api_client.post("posts", json=sample_post)

        assert response.status_code == 201, "Expected 201 Created"

        created_post = response.json()
        assert "id" in created_post, "Response should include new ID"
        assert created_post["title"] == sample_post["title"]
        assert created_post["body"] == sample_post["body"]
        assert created_post["userId"] == sample_post["userId"]

    def test_create_post_validates_required_fields(self, api_client):
        """Verify API validates required fields"""
        incomplete_post = {
            "title": "Test Post"
            # Missing body and userId
        }

        response = api_client.post("posts", json=incomplete_post)

        # Note: JSONPlaceholder doesn't actually validate
        # In a real API, this would return 400 Bad Request
        # For demonstration:
        # assert response.status_code == 400
        # assert "error" in response.json()

    def test_create_post_response_time(self, api_client, sample_post):
        """Verify post creation completes quickly"""
        start_time = time.time()
        response = api_client.post("posts", json=sample_post)
        duration = time.time() - start_time

        assert response.status_code == 201
        assert duration < 2.0, f"Request took too long: {duration}s"


# ============================================================================
# PUT REQUEST TESTS
# ============================================================================

class TestPutRequests:
    """Test suite for PUT (update) endpoints"""

    def test_update_post(self, api_client):
        """Verify we can update an existing post"""
        post_id = 1
        updated_data = {
            "id": post_id,
            "title": "Updated Title",
            "body": "Updated body content",
            "userId": 1
        }

        response = api_client.put(f"posts/{post_id}", json=updated_data)

        assert response.status_code == 200

        updated_post = response.json()
        assert updated_post["id"] == post_id
        assert updated_post["title"] == updated_data["title"]
        assert updated_post["body"] == updated_data["body"]

    def test_update_nonexistent_post(self, api_client):
        """Verify updating non-existent resource fails appropriately"""
        response = api_client.put("posts/99999", json={
            "id": 99999,
            "title": "Test",
            "body": "Test",
            "userId": 1
        })

        # JSONPlaceholder returns 200 even for non-existent
        # Real API would return 404
        # assert response.status_code == 404


# ============================================================================
# DELETE REQUEST TESTS
# ============================================================================

class TestDeleteRequests:
    """Test suite for DELETE endpoints"""

    def test_delete_post(self, api_client):
        """Verify we can delete a post"""
        post_id = 1
        response = api_client.delete(f"posts/{post_id}")

        assert response.status_code == 200

    def test_delete_nonexistent_post(self, api_client):
        """Verify deleting non-existent resource handled correctly"""
        response = api_client.delete("posts/99999")

        # JSONPlaceholder returns 200 regardless
        # Real API would return 404
        # assert response.status_code == 404


# ============================================================================
# SCHEMA VALIDATION TESTS
# ============================================================================

class TestResponseSchemas:
    """Test suite for validating response structures"""

    def test_post_schema(self, api_client):
        """Verify post response has correct structure and types"""
        response = api_client.get("posts/1")

        assert response.status_code == 200

        post = response.json()

        # Check all required fields exist
        required_fields = ["id", "userId", "title", "body"]
        for field in required_fields:
            assert field in post, f"Missing required field: {field}"

        # Check field types
        assert isinstance(post["id"], int), "id should be integer"
        assert isinstance(post["userId"], int), "userId should be integer"
        assert isinstance(post["title"], str), "title should be string"
        assert isinstance(post["body"], str), "body should be string"

        # Check value constraints
        assert post["id"] > 0, "id should be positive"
        assert len(post["title"]) > 0, "title should not be empty"

    def test_comment_schema(self, api_client):
        """Verify comment response has correct structure"""
        response = api_client.get("comments/1")

        assert response.status_code == 200

        comment = response.json()

        required_fields = ["postId", "id", "name", "email", "body"]
        for field in required_fields:
            assert field in comment, f"Missing required field: {field}"

        # Validate email format (basic check)
        assert "@" in comment["email"], "email should contain @"
        assert "." in comment["email"], "email should contain domain"


# ============================================================================
# PAGINATION TESTS
# ============================================================================

class TestPagination:
    """Test suite for pagination functionality"""

    def test_pagination_first_page(self, api_client):
        """Verify first page of results"""
        response = api_client.get("posts", params={"_page": 1, "_limit": 10})

        assert response.status_code == 200

        posts = response.json()
        assert len(posts) == 10, "Should return exactly 10 posts"

    def test_pagination_pages_dont_overlap(self, api_client):
        """Verify pagination pages contain unique items"""
        response1 = api_client.get("posts", params={"_page": 1, "_limit": 10})
        response2 = api_client.get("posts", params={"_page": 2, "_limit": 10})

        posts1 = response1.json()
        posts2 = response2.json()

        ids1 = set(post["id"] for post in posts1)
        ids2 = set(post["id"] for post in posts2)

        assert ids1.isdisjoint(ids2), "Pages should not have overlapping IDs"


# ============================================================================
# PARAMETRIZED TESTS
# ============================================================================

class TestParametrized:
    """Test suite demonstrating parametrized tests"""

    @pytest.mark.parametrize("post_id,expected_status", [
        (1, 200),
        (50, 200),
        (100, 200),
        (99999, 404),
    ])
    def test_get_post_status_codes(self, api_client, post_id, expected_status):
        """Test various post IDs return expected status codes"""
        response = api_client.get(f"posts/{post_id}")
        assert response.status_code == expected_status

    @pytest.mark.parametrize("user_id", [1, 2, 3, 5, 10])
    def test_get_posts_by_different_users(self, api_client, user_id):
        """Test filtering by different user IDs"""
        response = api_client.get("posts", params={"userId": user_id})

        assert response.status_code == 200

        posts = response.json()
        assert len(posts) > 0, f"User {user_id} should have posts"

        for post in posts:
            assert post["userId"] == user_id


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================

class TestPerformance:
    """Test suite for performance validation"""

    def test_response_time(self, api_client):
        """Verify API responds within acceptable time"""
        start = time.time()
        response = api_client.get("posts")
        duration = time.time() - start

        assert response.status_code == 200
        assert duration < 2.0, f"Response too slow: {duration:.2f}s"

    def test_concurrent_requests(self, api_client):
        """Verify API handles concurrent requests"""
        import concurrent.futures

        def make_request(post_id):
            return api_client.get(f"posts/{post_id}")

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            post_ids = range(1, 11)
            futures = [executor.submit(make_request, pid) for pid in post_ids]
            responses = [f.result() for f in concurrent.futures.as_completed(futures)]

        # All requests should succeed
        assert all(r.status_code == 200 for r in responses), "Some requests failed"

        # Calculate response times
        avg_time = sum(r.elapsed.total_seconds() for r in responses) / len(responses)
        assert avg_time < 1.0, f"Average response time too high: {avg_time:.2f}s"


# ============================================================================
# ERROR HANDLING TESTS
# ============================================================================

class TestErrorHandling:
    """Test suite for error scenarios"""

    def test_invalid_endpoint(self, api_client):
        """Verify 404 for invalid endpoint"""
        response = api_client.get("invalid-endpoint")

        assert response.status_code == 404

    def test_invalid_method(self, api_client):
        """Verify correct error for unsupported HTTP method"""
        # JSONPlaceholder may not enforce this, but real APIs should
        # response = api_client.session.patch(f"{BASE_URL}/posts/1")
        # assert response.status_code in [405, 501]
        pass

    def test_large_payload_handling(self, api_client):
        """Verify API handles large payloads"""
        large_post = {
            "title": "A" * 1000,
            "body": "B" * 10000,
            "userId": 1
        }

        response = api_client.post("posts", json=large_post)

        # Should either succeed or return appropriate error
        assert response.status_code in [201, 413], "Unexpected status code"


# ============================================================================
# HELPER FUNCTIONS FOR REUSE
# ============================================================================

def assert_valid_post(post: Dict[str, Any]):
    """
    Reusable assertion for validating post structure

    Args:
        post: Post object to validate

    Raises:
        AssertionError: If post is invalid
    """
    required_fields = ["id", "userId", "title", "body"]

    for field in required_fields:
        assert field in post, f"Missing required field: {field}"

    assert isinstance(post["id"], int)
    assert isinstance(post["userId"], int)
    assert isinstance(post["title"], str)
    assert isinstance(post["body"], str)
    assert post["id"] > 0
    assert post["userId"] > 0


def assert_response_time_acceptable(response, max_time: float = 2.0):
    """
    Reusable assertion for response time

    Args:
        response: requests.Response object
        max_time: Maximum acceptable response time in seconds
    """
    duration = response.elapsed.total_seconds()
    assert duration < max_time, f"Response time {duration:.2f}s exceeds {max_time}s"


# ============================================================================
# RUN WITH: pytest api-test-example.py -v
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
