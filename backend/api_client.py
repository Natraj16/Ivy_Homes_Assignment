"""
Ivy Homes API Client
Downloads and stores all listings, rentals, and projects locally
"""

import requests
import json
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, List, Any

class IvyAPIClient:
    def __init__(self, base_url: str, api_key: str, email: str, password: str, city: str = "Gurgaon"):
        self.base_url = base_url
        self.api_key = api_key
        self.email = email
        self.password = password
        self.city = city
        self.data_dir = Path(__file__).parent.parent / "data"
        self.data_dir.mkdir(exist_ok=True)
        
        # Reference time for calculations
        self.reference_time = datetime(2026, 9, 10, 0, 0, 0, tzinfo=timezone(timedelta(hours=5, minutes=30)))
        
        # Test health endpoint first
        self.test_connection()
        
        # Login to get bearer token
        self.token = None
        self.headers = {"Content-Type": "application/json", "X-API-Key": self.api_key}
        self.login()
    
    def test_connection(self):
        """Test connection with health endpoint (unauthenticated)"""
        url = f"{self.base_url}/health"
        try:
            response = requests.get(url, timeout=10)
            data = response.json()
            print(f"OK API Connection OK - Server time: {data.get('timestamp', 'N/A')}")
        except Exception as e:
            print(f"FAIL Connection test failed: {e}")
            
    def login(self):
        """Login with email/password to get bearer token"""
        url = f"{self.base_url}/auth/login"
        payload = {"email": self.email, "password": self.password}
        try:
            response = requests.post(url, json=payload, headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            self.token = data.get("access_token")
            if self.token:
                self.headers["Authorization"] = f"Bearer {self.token}"
                print(f"OK Logged in as {self.email}")
            else:
                print(f"WARNING: No token in response: {data}")
                raise Exception("No token received from login")
        except Exception as e:
            print(f"FAIL Login failed: {e}")
            if 'response' in locals() and hasattr(response, 'text'):
                print(f"Response text: {response.text}")
            raise
        
    def get(self, endpoint: str, params: Dict = None) -> Dict:
        """Make GET request to API"""
        url = f"{self.base_url}{endpoint}"
        if params is None:
            params = {}
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            if endpoint == "/v1/listings" and params.get("offset") == 0:
                print(f"Debug {endpoint} response keys: {data.keys()}")
                if "results" in data:
                    print(f"Debug {endpoint} results length: {len(data['results'])}")
                if "data" in data:
                    print(f"Debug {endpoint} data length: {len(data['data'])}")
            return data
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def fetch_all_listings(self) -> List[Dict]:
        """Fetch all listings with pagination"""
        print("Fetching all listings...")
        all_listings = []
        limit = 100
        offset = 0
        
        while True:
            params = {"limit": limit, "offset": offset}
            response = self.get("/v1/listings", params)
            
            if not response or "results" not in response:
                break
                
            listings = response.get("results", [])
            if not listings:
                break
                
            all_listings.extend(listings)
            print(f"  Fetched {len(listings)} listings (offset: {offset})")
            
            # Check if there are more records
            if not response.get("has_more", False):
                break
                
            offset += len(listings)
            time.sleep(0.1)  # Rate limiting
        
        print(f"Total listings fetched: {len(all_listings)}")
        self.save_data("listings.json", all_listings)
        return all_listings
    
    def fetch_all_rentals(self) -> List[Dict]:
        """Fetch all rentals with pagination"""
        print("Fetching all rentals...")
        all_rentals = []
        limit = 100
        offset = 0
        
        while True:
            params = {"limit": limit, "offset": offset}
            response = self.get("/v1/rentals", params)
            
            if not response or "results" not in response:
                break
                
            rentals = response.get("results", [])
            if not rentals:
                break
                
            all_rentals.extend(rentals)
            print(f"  Fetched {len(rentals)} rentals (offset: {offset})")
            
            if not response.get("has_more", False):
                break
                
            offset += len(rentals)
            time.sleep(0.1)
        
        print(f"Total rentals fetched: {len(all_rentals)}")
        self.save_data("rentals.json", all_rentals)
        return all_rentals
    
    def fetch_all_projects(self) -> List[Dict]:
        """Fetch all projects with pagination"""
        print("Fetching all projects...")
        all_projects = []
        limit = 100
        offset = 0
        
        while True:
            params = {"limit": limit, "offset": offset}
            response = self.get("/v1/projects", params)
            
            if not response or "results" not in response:
                break
                
            projects = response.get("results", [])
            if not projects:
                break
                
            all_projects.extend(projects)
            print(f"  Fetched {len(projects)} projects (offset: {offset})")
            
            if not response.get("has_more", False):
                break
                
            offset += len(projects)
            time.sleep(0.1)
        
        print(f"Total projects fetched: {len(all_projects)}")
        self.save_data("projects.json", all_projects)
        return all_projects
    
    def save_data(self, filename: str, data: Any):
        """Save data to JSON file"""
        filepath = self.data_dir / filename
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)
        print(f"  Saved to {filepath}")
    
    def load_data(self, filename: str) -> Any:
        """Load data from JSON file"""
        filepath = self.data_dir / filename
        if not filepath.exists():
            return None
        with open(filepath, "r") as f:
            return json.load(f)
    
    def download_all(self):
        """Download all data from API"""
        print(f"\n{'='*60}")
        print(f"Starting data download for {self.city}")
        print(f"Base URL: {self.base_url}")
        print(f"{'='*60}\n")
        
        listings = self.fetch_all_listings()
        rentals = self.fetch_all_rentals()
        projects = self.fetch_all_projects()
        
        print(f"\n{'='*60}")
        print(f"Download complete!")
        print(f"Listings: {len(listings)}")
        print(f"Rentals: {len(rentals)}")
        print(f"Projects: {len(projects)}")
        print(f"{'='*60}\n")
        
        return {
            "listings": listings,
            "rentals": rentals,
            "projects": projects
        }


if __name__ == "__main__":
    BASE_URL = "https://solve.ivy.homes"
    API_KEY = "IVY26-E9D2ECCA680D"
    # Demo account credentials (email from API_REFERENCE.md)
    EMAIL = "demo1@ivy.homes"
    PASSWORD = "cbed6d7335"
    
    client = IvyAPIClient(BASE_URL, API_KEY, EMAIL, PASSWORD)
    client.download_all()
