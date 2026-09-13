"""
Analysis script to answer the 10 assignment questions
"""

import json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Set, Any
from collections import defaultdict

class IvyAnalyzer:
    def __init__(self, data_dir: Path = None):
        if data_dir is None:
            data_dir = Path(__file__).parent.parent / "data"
        self.data_dir = data_dir
        
        # Load all data
        self.listings = self.load_data("listings.json")
        self.rentals = self.load_data("rentals.json")
        self.projects = self.load_data("projects.json")
        
        # Reference time (IST)
        self.reference_time = datetime(2026, 9, 10, 0, 0, 0, tzinfo=timezone(timedelta(hours=5, minutes=30)))
        self.seven_days_before = self.reference_time - timedelta(days=7)
        
        # Assigned locality for question 5
        self.assigned_locality = "Sector 82"
        
    def load_data(self, filename: str) -> List[Dict]:
        """Load data from JSON file"""
        filepath = self.data_dir / filename
        if not filepath.exists():
            print(f"Warning: {filename} not found")
            return []
        with open(filepath, "r") as f:
            return json.load(f)
    
    def q1_total_listing_records(self) -> int:
        """Q1: How many listing records are retrievable from /v1/listings?"""
        return len(self.listings)
    
    def q2_unique_properties(self) -> int:
        """Q2: Among those records, how many distinct properties?"""
        unique_properties = set()
        for listing in self.listings:
            # Use physical attributes to identify a unique property
            key = (
                listing.get("apartment_name"),
                listing.get("floor"),
                listing.get("carpet_area"),
                listing.get("facing_direction")
            )
            unique_properties.add(key)
        return len(unique_properties)
    
    def q3_active_listings(self) -> int:
        """Q3: How many retrievable listing records have is_live true?"""
        active = sum(1 for listing in self.listings if listing.get("is_live", False) is True)
        return active
    
    def q4_corrupt_listing_ids(self) -> List[str]:
        """Q4: Listing records that describe something impossible"""
        corrupt = []
        for listing in self.listings:
            # Floor greater than total floors
            if listing.get("floor", 0) > listing.get("total_floors", 0):
                corrupt.append(listing.get("listing_id"))
            # Carpet area greater than super built up area
            elif listing.get("carpet_area", 0) > listing.get("super_built_up_area", 0):
                corrupt.append(listing.get("listing_id"))
        return sorted(list(set(corrupt)))
    
    def q5_total_monthly_rent(self) -> float:
        """Q5: Sum of monthly rent across all rentals in assigned locality (Sector 82)"""
        total_rent = 0.0
        for rental in self.rentals:
            if rental.get("locality") == self.assigned_locality.lower():
                total_rent += float(rental.get("price", 0))
        return total_rent
    
    def q6_avg_price_per_sqft_2bhk(self) -> float:
        """Q6: Mean price/sqft for 2BHK with is_live=true, excluding corrupt & fake"""
        corrupt_ids = set(self.q4_corrupt_listing_ids())
        fake_ids = set(self.q9_fake_listing_ids())
        exclude = corrupt_ids | fake_ids
        
        total_price_per_sqft = 0.0
        count = 0
        
        for listing in self.listings:
            if listing.get("listing_id") in exclude:
                continue
            if listing.get("is_live", False) is not True:
                continue
            if listing.get("bedroom") != 2:
                continue
            
            price = listing.get("price", 0)
            carpet_area = listing.get("carpet_area", 0)
            if carpet_area > 0:
                price_per_sqft = price / carpet_area
                total_price_per_sqft += price_per_sqft
                count += 1
        
        if count == 0:
            return 0.0
        return round(total_price_per_sqft / count, 2)
    
    def q7_costliest_project(self) -> Dict[str, Any]:
        """Q7: Project with highest max price"""
        max_project = None
        max_price = -1
        
        for project in self.projects:
            # price_max is in Crores, need to convert to INR
            price_cr = project.get("price_max", 0)
            price_inr = int(price_cr * 10000000) if price_cr else 0
            if price_inr > max_price:
                max_price = price_inr
                max_project = project
        
        if max_project:
            return {
                "project_id": max_project.get("project_id", ""),
                "price_max_inr": max_price
            }
        return {"project_id": "", "price_max_inr": 0}
    
    def q8_listings_last_7_days(self) -> int:
        """Q8: Listings posted in [REFERENCE - 7 days, REFERENCE)"""
        count = 0
        for listing in self.listings:
            try:
                posted_at_str = listing.get("posted_at")
                if posted_at_str:
                    posted_at = datetime.fromisoformat(posted_at_str.replace('Z', '+00:00'))
                    if self.seven_days_before <= posted_at < self.reference_time:
                        count += 1
            except:
                pass
        return count
    
    def q9_fake_listing_ids(self) -> List[str]:
        """Q9: Listings that are not real (generated to get enquiries)"""
        fake = []
        for listing in self.listings:
            # Listings priced incredibly low are likely fakes to generate enquiries
            if 0 < listing.get("price", 0) < 100000:
                fake.append(listing.get("listing_id"))
        return sorted(list(set(fake)))
    
    def q10_projects_with_wrong_listing_count(self) -> int:
        """Q10: Projects where reported listing count != actual count"""
        wrong_count = 0
        
        for project in self.projects:
            project_id = project.get("project_id")
            reported_count = project.get("total_listings", 0)
            
            # Count actual listings for this project (must be active as per doc intent)
            actual_count = sum(1 for listing in self.listings 
                             if listing.get("project_id") == project_id and listing.get("is_live", False) is True)
            
            if actual_count != reported_count:
                wrong_count += 1
        
        return wrong_count
    
    def generate_answers(self) -> Dict[str, Any]:
        """Generate all 10 answers"""
        answers = {
            "total_listing_records": self.q1_total_listing_records(),
            "unique_properties": self.q2_unique_properties(),
            "active_listings": self.q3_active_listings(),
            "corrupt_listing_ids": self.q4_corrupt_listing_ids(),
            "total_monthly_rent": self.q5_total_monthly_rent(),
            "avg_price_per_sqft_2bhk": self.q6_avg_price_per_sqft_2bhk(),
            "costliest_project": self.q7_costliest_project(),
            "listings_last_7_days": self.q8_listings_last_7_days(),
            "fake_listing_ids": self.q9_fake_listing_ids(),
            "projects_with_wrong_listing_count": self.q10_projects_with_wrong_listing_count()
        }
        return answers
    
    def print_answers(self):
        """Print all answers in structured format"""
        answers = self.generate_answers()
        print("\n" + "="*60)
        print("ASSIGNMENT ANSWERS")
        print("="*60)
        
        for i, (key, value) in enumerate(answers.items(), 1):
            print(f"\nQ{i} ({key}):")
            if isinstance(value, list):
                print(f"  {len(value)} items: {value[:10]}{'...' if len(value) > 10 else ''}")
            elif isinstance(value, dict):
                print(f"  {json.dumps(value, indent=2)}")
            else:
                print(f"  {value}")
        
        print("\n" + "="*60 + "\n")
        return answers


if __name__ == "__main__":
    analyzer = IvyAnalyzer()
    answers = analyzer.print_answers()
    
    # Save answers to JSON
    output_path = Path(__file__).parent.parent / "analysis" / "answers.json"
    output_path.parent.mkdir(exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(answers, f, indent=2)
    print(f"Answers saved to {output_path}")
