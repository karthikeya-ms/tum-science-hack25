#!/usr/bin/env python3
"""
Simple Kharkiv Mine Risk Heatmap Visualization

This script creates a basic heatmap using only standard Python libraries.
Requires: matplotlib, numpy, json (all usually available by default)
"""

import json
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib.patches import Rectangle
import sys

def load_geojson_data(filepath):
    """Load and parse the GeoJSON file."""
    print(f"Loading data from {filepath}...")
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        print(f"✅ Loaded {len(data['features'])} features")
        return data
    except FileNotFoundError:
        print(f"❌ Error: File '{filepath}' not found!")
        return None
    except Exception as e:
        print(f"❌ Error loading file: {e}")
        return None

def extract_risk_data(geojson_data):
    """Extract risk values and coordinates from GeoJSON features."""
    if not geojson_data:
        return []
    
    risk_data = []
    print("Extracting risk data from polygons...")
    
    for i, feature in enumerate(geojson_data['features']):
        if i % 10000 == 0:  # Progress indicator
            print(f"  Processing feature {i+1:,}/{len(geojson_data['features']):,}")
        
        risk = feature['properties'].get('risk', 0)
        geometry = feature['geometry']
        
        if geometry['type'] == 'Polygon' and geometry['coordinates']:
            # Get the centroid of the polygon
            coords = geometry['coordinates'][0]  # First ring (outer boundary)
            if len(coords) > 0:
                lons = [coord[0] for coord in coords if len(coord) >= 2]
                lats = [coord[1] for coord in coords if len(coord) >= 2]
                
                if lons and lats:  # Make sure we have valid coordinates
                    # Calculate centroid
                    centroid_lon = sum(lons) / len(lons)
                    centroid_lat = sum(lats) / len(lats)
                    
                    risk_data.append({
                        'lat': centroid_lat,
                        'lon': centroid_lon,
                        'risk': risk
                    })
    
    print(f"✅ Extracted {len(risk_data)} valid risk data points")
    return risk_data

def create_scatter_heatmap(risk_data, output_file='kharkiv_simple_heatmap.png'):
    """Create a simple scatter plot heatmap."""
    if not risk_data:
        print("❌ No data to plot!")
        return None
    
    print("Creating scatter heatmap...")
    
    # Extract data for plotting
    lats = [item['lat'] for item in risk_data]
    lons = [item['lon'] for item in risk_data]
    risks = [item['risk'] for item in risk_data]
    
    # Create figure with proper size
    plt.figure(figsize=(16, 12))
    
    # Create scatter plot with color mapping
    scatter = plt.scatter(lons, lats, c=risks, cmap='YlOrRd', 
                         s=0.5, alpha=0.7, edgecolors='none')
    
    # Add colorbar
    cbar = plt.colorbar(scatter, shrink=0.8, pad=0.02)
    cbar.set_label('Mine Risk Level', fontsize=14, fontweight='bold')
    cbar.ax.tick_params(labelsize=12)
    
    # Set labels and title
    plt.xlabel('Longitude', fontsize=14, fontweight='bold')
    plt.ylabel('Latitude', fontsize=14, fontweight='bold')
    plt.title('Kharkiv Region Mine Risk Heatmap', fontsize=18, fontweight='bold', pad=20)
    
    # Add grid
    plt.grid(True, alpha=0.3, linestyle='--')
    
    # Set aspect ratio to be equal
    plt.gca().set_aspect('equal', adjustable='box')
    
    # Add statistics text box
    stats_text = (f'Risk Statistics:\n'
                 f'Total Areas: {len(risks):,}\n'
                 f'Min Risk: {min(risks):.3f}\n'
                 f'Max Risk: {max(risks):.3f}\n'
                 f'Mean Risk: {np.mean(risks):.3f}\n'
                 f'Std Dev: {np.std(risks):.3f}')
    
    plt.text(0.02, 0.98, stats_text, transform=plt.gca().transAxes, 
            verticalalignment='top', fontsize=11,
            bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9))
    
    # Improve layout
    plt.tight_layout()
    
    # Save with high DPI
    plt.savefig(output_file, dpi=300, bbox_inches='tight', facecolor='white')
    print(f"✅ Heatmap saved as {output_file}")
    
    # Also show the plot
    plt.show()
    
    return plt.gcf()

def create_grid_heatmap(risk_data, output_file='kharkiv_grid_heatmap.png', grid_size=100):
    """Create a grid-based heatmap by binning the data."""
    if not risk_data:
        print("❌ No data to plot!")
        return None
    
    print("Creating grid-based heatmap...")
    
    # Extract coordinates and risks
    lats = np.array([item['lat'] for item in risk_data])
    lons = np.array([item['lon'] for item in risk_data])
    risks = np.array([item['risk'] for item in risk_data])
    
    # Define grid boundaries
    lat_min, lat_max = lats.min(), lats.max()
    lon_min, lon_max = lons.min(), lons.max()
    
    # Create 2D histogram
    risk_grid, lon_edges, lat_edges = np.histogram2d(
        lons, lats, bins=grid_size, weights=risks,
        range=[[lon_min, lon_max], [lat_min, lat_max]]
    )
    
    # Count grid for normalization
    count_grid, _, _ = np.histogram2d(
        lons, lats, bins=grid_size,
        range=[[lon_min, lon_max], [lat_min, lat_max]]
    )
    
    # Normalize to get average risk per grid cell
    # Avoid division by zero
    with np.errstate(divide='ignore', invalid='ignore'):
        risk_grid_avg = np.divide(risk_grid, count_grid, 
                                 out=np.zeros_like(risk_grid), 
                                 where=count_grid!=0)
    
    # Create the plot
    plt.figure(figsize=(16, 12))
    
    # Plot the grid heatmap
    im = plt.imshow(risk_grid_avg.T, origin='lower', cmap='YlOrRd',
                   extent=[lon_min, lon_max, lat_min, lat_max],
                   aspect='auto', alpha=0.8)
    
    # Add colorbar
    cbar = plt.colorbar(im, shrink=0.8, pad=0.02)
    cbar.set_label('Average Mine Risk Level', fontsize=14, fontweight='bold')
    cbar.ax.tick_params(labelsize=12)
    
    # Set labels and title
    plt.xlabel('Longitude', fontsize=14, fontweight='bold')
    plt.ylabel('Latitude', fontsize=14, fontweight='bold')
    plt.title('Kharkiv Region Mine Risk - Grid Heatmap', fontsize=18, fontweight='bold', pad=20)
    
    # Add grid
    plt.grid(True, alpha=0.3, linestyle='--', color='white')
    
    # Add statistics
    valid_cells = count_grid > 0
    stats_text = (f'Grid Statistics:\n'
                 f'Grid Size: {grid_size}×{grid_size}\n'
                 f'Active Cells: {np.sum(valid_cells):,}\n'
                 f'Max Avg Risk: {np.max(risk_grid_avg[valid_cells]):.3f}\n'
                 f'Min Avg Risk: {np.min(risk_grid_avg[valid_cells]):.3f}')
    
    plt.text(0.02, 0.98, stats_text, transform=plt.gca().transAxes, 
            verticalalignment='top', fontsize=11,
            bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9))
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight', facecolor='white')
    print(f"✅ Grid heatmap saved as {output_file}")
    
    plt.show()
    return plt.gcf()

def generate_risk_analysis(risk_data):
    """Generate detailed risk analysis and statistics."""
    if not risk_data:
        print("❌ No data for analysis!")
        return {}
    
    risks = [item['risk'] for item in risk_data]
    
    # Calculate statistics
    stats = {
        'total_areas': len(risks),
        'min_risk': min(risks),
        'max_risk': max(risks),
        'mean_risk': np.mean(risks),
        'median_risk': np.median(risks),
        'std_risk': np.std(risks),
        'q25_risk': np.percentile(risks, 25),
        'q75_risk': np.percentile(risks, 75),
    }
    
    # Risk level categorization
    stats['zero_risk'] = sum(1 for r in risks if r == 0.0)
    stats['very_low_risk'] = sum(1 for r in risks if 0.0 < r <= 0.2)
    stats['low_risk'] = sum(1 for r in risks if 0.2 < r <= 0.4)
    stats['medium_risk'] = sum(1 for r in risks if 0.4 < r <= 0.6)
    stats['high_risk'] = sum(1 for r in risks if 0.6 < r <= 0.8)
    stats['very_high_risk'] = sum(1 for r in risks if r > 0.8)
    
    # Print comprehensive analysis
    print("\n" + "="*60)
    print("🎯 KHARKIV MINE RISK COMPREHENSIVE ANALYSIS")
    print("="*60)
    print(f"📊 Dataset Overview:")
    print(f"   Total Areas Analyzed: {stats['total_areas']:,}")
    print(f"   Geographic Coverage: {len(set((d['lat'], d['lon']) for d in risk_data)):,} unique locations")
    
    print(f"\n📈 Risk Statistics:")
    print(f"   Range: {stats['min_risk']:.4f} - {stats['max_risk']:.4f}")
    print(f"   Mean: {stats['mean_risk']:.4f}")
    print(f"   Median: {stats['median_risk']:.4f}")
    print(f"   Std Deviation: {stats['std_risk']:.4f}")
    print(f"   25th Percentile: {stats['q25_risk']:.4f}")
    print(f"   75th Percentile: {stats['q75_risk']:.4f}")
    
    print(f"\n🚨 Risk Level Distribution:")
    total = stats['total_areas']
    print(f"   🟢 Zero Risk (0.0): {stats['zero_risk']:,} areas ({stats['zero_risk']/total*100:.1f}%)")
    print(f"   🟡 Very Low (0.0-0.2): {stats['very_low_risk']:,} areas ({stats['very_low_risk']/total*100:.1f}%)")
    print(f"   🟠 Low (0.2-0.4): {stats['low_risk']:,} areas ({stats['low_risk']/total*100:.1f}%)")
    print(f"   🟠 Medium (0.4-0.6): {stats['medium_risk']:,} areas ({stats['medium_risk']/total*100:.1f}%)")
    print(f"   🔴 High (0.6-0.8): {stats['high_risk']:,} areas ({stats['high_risk']/total*100:.1f}%)")
    print(f"   🔴 Very High (>0.8): {stats['very_high_risk']:,} areas ({stats['very_high_risk']/total*100:.1f}%)")
    
    # Calculate risk hotspots
    high_risk_areas = stats['high_risk'] + stats['very_high_risk']
    print(f"\n⚠️  Critical Risk Assessment:")
    print(f"   High Risk Areas: {high_risk_areas:,} ({high_risk_areas/total*100:.1f}%)")
    print(f"   Safe Areas (≤0.2): {stats['zero_risk'] + stats['very_low_risk']:,} ({(stats['zero_risk'] + stats['very_low_risk'])/total*100:.1f}%)")
    
    print("="*60)
    
    return stats

def create_risk_distribution_plot(risk_data, output_file='kharkiv_risk_distribution.png'):
    """Create a histogram showing risk distribution."""
    if not risk_data:
        return None
    
    print("Creating risk distribution plot...")
    
    risks = [item['risk'] for item in risk_data]
    
    plt.figure(figsize=(12, 8))
    
    # Create histogram
    n, bins, patches = plt.hist(risks, bins=50, alpha=0.7, edgecolor='black', linewidth=0.5)
    
    # Color the bars based on risk level
    for i, patch in enumerate(patches):
        bin_center = (bins[i] + bins[i+1]) / 2
        if bin_center <= 0.2:
            patch.set_facecolor('green')
        elif bin_center <= 0.4:
            patch.set_facecolor('yellow')
        elif bin_center <= 0.6:
            patch.set_facecolor('orange')
        elif bin_center <= 0.8:
            patch.set_facecolor('red')
        else:
            patch.set_facecolor('darkred')
    
    plt.xlabel('Risk Level', fontsize=14, fontweight='bold')
    plt.ylabel('Number of Areas', fontsize=14, fontweight='bold')
    plt.title('Distribution of Mine Risk Levels in Kharkiv Region', fontsize=16, fontweight='bold')
    plt.grid(True, alpha=0.3)
    
    # Add vertical lines for percentiles
    plt.axvline(np.mean(risks), color='blue', linestyle='--', linewidth=2, label=f'Mean: {np.mean(risks):.3f}')
    plt.axvline(np.median(risks), color='red', linestyle='--', linewidth=2, label=f'Median: {np.median(risks):.3f}')
    
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"✅ Risk distribution plot saved as {output_file}")
    
    plt.show()
    return plt.gcf()

def main():
    """Main function to run the heatmap visualization."""
    input_file = 'kharkiv_mine_risk_leader_partitioned.json'
    
    print("🗺️  Kharkiv Mine Risk Heatmap Generator")
    print("="*50)
    
    # Load data
    geojson_data = load_geojson_data(input_file)
    if not geojson_data:
        print("❌ Cannot proceed without data file!")
        return
    
    # Extract risk data
    risk_data = extract_risk_data(geojson_data)
    if not risk_data:
        print("❌ No valid risk data found!")
        return
    
    # Generate analysis
    stats = generate_risk_analysis(risk_data)
    
    # Create visualizations
    print(f"\n🎨 Generating visualizations...")
    
    try:
        # 1. Scatter heatmap
        create_scatter_heatmap(risk_data)
        
        # 2. Grid heatmap  
        create_grid_heatmap(risk_data)
        
        # 3. Risk distribution
        create_risk_distribution_plot(risk_data)
        
        print(f"\n✅ All visualizations completed successfully!")
        print(f"📁 Generated files:")
        print(f"   • kharkiv_simple_heatmap.png")
        print(f"   • kharkiv_grid_heatmap.png") 
        print(f"   • kharkiv_risk_distribution.png")
        
    except Exception as e:
        print(f"❌ Error during visualization: {e}")
        print("Make sure you have matplotlib and numpy installed:")
        print("pip install matplotlib numpy")

if __name__ == "__main__":
    main() 