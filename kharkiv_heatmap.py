#!/usr/bin/env python3
"""
Kharkiv Mine Risk Heatmap Visualization

This script loads the Kharkiv mine risk GeoJSON data and creates interactive and static heatmaps.
"""

import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.colors as colors
from matplotlib.patches import Polygon
from matplotlib.collections import PatchCollection
import folium
from folium.plugins import HeatMap
import geopandas as gpd
from shapely.geometry import shape
import seaborn as sns
from scipy.interpolate import griddata

def load_geojson_data(filepath):
    """Load and parse the GeoJSON file."""
    print(f"Loading data from {filepath}...")
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    print(f"Loaded {len(data['features'])} features")
    return data

def extract_risk_data(geojson_data):
    """Extract risk values and coordinates from GeoJSON features."""
    risk_data = []
    
    for feature in geojson_data['features']:
        risk = feature['properties'].get('risk', 0)
        geometry = feature['geometry']
        
        if geometry['type'] == 'Polygon':
            # Get the centroid of the polygon
            coords = geometry['coordinates'][0]  # First ring
            lons = [coord[0] for coord in coords]
            lats = [coord[1] for coord in coords]
            
            # Calculate centroid
            centroid_lon = sum(lons) / len(lons)
            centroid_lat = sum(lats) / len(lats)
            
            risk_data.append({
                'lat': centroid_lat,
                'lon': centroid_lon,
                'risk': risk,
                'geometry': shape(geometry)
            })
    
    return risk_data

def create_static_heatmap(risk_data, output_file='kharkiv_mine_risk_heatmap.png'):
    """Create a static heatmap using matplotlib."""
    print("Creating static heatmap...")
    
    # Extract data for plotting
    lats = [item['lat'] for item in risk_data]
    lons = [item['lon'] for item in risk_data]
    risks = [item['risk'] for item in risk_data]
    
    # Create figure and axis
    fig, ax = plt.subplots(figsize=(15, 12))
    
    # Create a scatter plot with color mapping
    scatter = ax.scatter(lons, lats, c=risks, cmap='YlOrRd', 
                        s=1, alpha=0.7, edgecolors='none')
    
    # Add colorbar
    cbar = plt.colorbar(scatter, ax=ax, shrink=0.8)
    cbar.set_label('Mine Risk Level', fontsize=12)
    
    # Set labels and title
    ax.set_xlabel('Longitude', fontsize=12)
    ax.set_ylabel('Latitude', fontsize=12)
    ax.set_title('Kharkiv Region Mine Risk Heatmap', fontsize=16, fontweight='bold')
    
    # Add grid
    ax.grid(True, alpha=0.3)
    
    # Set aspect ratio to be equal
    ax.set_aspect('equal', adjustable='box')
    
    # Add statistics text
    stats_text = f'Risk Statistics:\nMin: {min(risks):.3f}\nMax: {max(risks):.3f}\nMean: {np.mean(risks):.3f}\nStd: {np.std(risks):.3f}'
    ax.text(0.02, 0.98, stats_text, transform=ax.transAxes, 
            verticalalignment='top', bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"Static heatmap saved as {output_file}")
    return fig

def create_interpolated_heatmap(risk_data, output_file='kharkiv_interpolated_heatmap.png'):
    """Create an interpolated grid heatmap."""
    print("Creating interpolated heatmap...")
    
    # Extract coordinates and risk values
    lats = np.array([item['lat'] for item in risk_data])
    lons = np.array([item['lon'] for item in risk_data])
    risks = np.array([item['risk'] for item in risk_data])
    
    # Create a regular grid
    lat_min, lat_max = lats.min(), lats.max()
    lon_min, lon_max = lons.min(), lons.max()
    
    # Create grid points
    grid_resolution = 200
    lon_grid = np.linspace(lon_min, lon_max, grid_resolution)
    lat_grid = np.linspace(lat_min, lat_max, grid_resolution)
    lon_mesh, lat_mesh = np.meshgrid(lon_grid, lat_grid)
    
    # Interpolate risk values onto the grid
    points = np.column_stack((lons, lats))
    grid_points = np.column_stack((lon_mesh.ravel(), lat_mesh.ravel()))
    
    # Use griddata for interpolation
    interpolated_risks = griddata(points, risks, grid_points, method='cubic', fill_value=0)
    interpolated_risks = interpolated_risks.reshape(lon_mesh.shape)
    
    # Create the plot
    fig, ax = plt.subplots(figsize=(15, 12))
    
    # Create heatmap
    im = ax.imshow(interpolated_risks, extent=[lon_min, lon_max, lat_min, lat_max], 
                   cmap='YlOrRd', aspect='auto', origin='lower', alpha=0.8)
    
    # Add colorbar
    cbar = plt.colorbar(im, ax=ax, shrink=0.8)
    cbar.set_label('Mine Risk Level', fontsize=12)
    
    # Overlay scatter points
    ax.scatter(lons, lats, c='black', s=0.1, alpha=0.3)
    
    # Set labels and title
    ax.set_xlabel('Longitude', fontsize=12)
    ax.set_ylabel('Latitude', fontsize=12)
    ax.set_title('Kharkiv Region Mine Risk - Interpolated Heatmap', fontsize=16, fontweight='bold')
    
    # Add grid
    ax.grid(True, alpha=0.3, color='white')
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"Interpolated heatmap saved as {output_file}")
    return fig

def create_interactive_heatmap(risk_data, output_file='kharkiv_interactive_heatmap.html'):
    """Create an interactive heatmap using Folium."""
    print("Creating interactive heatmap...")
    
    # Extract data for heatmap
    heat_data = [[item['lat'], item['lon'], item['risk']] for item in risk_data]
    
    # Calculate center point
    center_lat = np.mean([item['lat'] for item in risk_data])
    center_lon = np.mean([item['lon'] for item in risk_data])
    
    # Create base map
    m = folium.Map(
        location=[center_lat, center_lon],
        zoom_start=10,
        tiles='OpenStreetMap'
    )
    
    # Add heatmap layer
    HeatMap(
        heat_data,
        min_opacity=0.2,
        radius=15,
        blur=10,
        max_zoom=1,
        gradient={0.0: 'blue', 0.3: 'lime', 0.6: 'yellow', 1.0: 'red'}
    ).add_to(m)
    
    # Add layer control
    folium.TileLayer('CartoDB positron').add_to(m)
    folium.TileLayer('CartoDB dark_matter').add_to(m)
    folium.LayerControl().add_to(m)
    
    # Add title
    title_html = '''
                 <h3 align="center" style="font-size:20px"><b>Kharkiv Region Mine Risk Heatmap</b></h3>
                 '''
    m.get_root().html.add_child(folium.Element(title_html))
    
    # Save map
    m.save(output_file)
    print(f"Interactive heatmap saved as {output_file}")
    return m

def create_polygon_heatmap(geojson_data, output_file='kharkiv_polygon_heatmap.png'):
    """Create a heatmap showing actual polygon boundaries."""
    print("Creating polygon-based heatmap...")
    
    # Convert to GeoDataFrame
    gdf = gpd.GeoDataFrame.from_features(geojson_data['features'])
    
    # Create figure
    fig, ax = plt.subplots(figsize=(15, 12))
    
    # Plot with risk-based coloring
    gdf.plot(column='risk', cmap='YlOrRd', ax=ax, 
             edgecolor='none', alpha=0.8, legend=True,
             legend_kwds={'shrink': 0.8, 'label': 'Mine Risk Level'})
    
    # Set labels and title
    ax.set_xlabel('Longitude', fontsize=12)
    ax.set_ylabel('Latitude', fontsize=12)
    ax.set_title('Kharkiv Region Mine Risk - Polygon Heatmap', fontsize=16, fontweight='bold')
    
    # Remove axis ticks for cleaner look
    ax.set_xticks([])
    ax.set_yticks([])
    
    # Add risk statistics
    risks = gdf['risk'].values
    stats_text = f'Risk Statistics:\nTotal Polygons: {len(risks)}\nMin Risk: {min(risks):.3f}\nMax Risk: {max(risks):.3f}\nMean Risk: {np.mean(risks):.3f}'
    ax.text(0.02, 0.98, stats_text, transform=ax.transAxes, 
            verticalalignment='top', bbox=dict(boxstyle='round', facecolor='white', alpha=0.9))
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"Polygon heatmap saved as {output_file}")
    return fig

def generate_risk_statistics(risk_data):
    """Generate comprehensive risk statistics."""
    risks = [item['risk'] for item in risk_data]
    
    stats = {
        'total_areas': len(risks),
        'min_risk': min(risks),
        'max_risk': max(risks),
        'mean_risk': np.mean(risks),
        'median_risk': np.median(risks),
        'std_risk': np.std(risks),
        'high_risk_areas': sum(1 for r in risks if r > 0.7),
        'medium_risk_areas': sum(1 for r in risks if 0.3 < r <= 0.7),
        'low_risk_areas': sum(1 for r in risks if r <= 0.3),
        'zero_risk_areas': sum(1 for r in risks if r == 0)
    }
    
    print("\n" + "="*50)
    print("KHARKIV MINE RISK STATISTICS")
    print("="*50)
    print(f"Total Areas Analyzed: {stats['total_areas']:,}")
    print(f"Risk Range: {stats['min_risk']:.3f} - {stats['max_risk']:.3f}")
    print(f"Mean Risk Level: {stats['mean_risk']:.3f}")
    print(f"Median Risk Level: {stats['median_risk']:.3f}")
    print(f"Standard Deviation: {stats['std_risk']:.3f}")
    print("\nRisk Distribution:")
    print(f"  High Risk (>0.7): {stats['high_risk_areas']:,} areas ({stats['high_risk_areas']/stats['total_areas']*100:.1f}%)")
    print(f"  Medium Risk (0.3-0.7): {stats['medium_risk_areas']:,} areas ({stats['medium_risk_areas']/stats['total_areas']*100:.1f}%)")
    print(f"  Low Risk (≤0.3): {stats['low_risk_areas']:,} areas ({stats['low_risk_areas']/stats['total_areas']*100:.1f}%)")
    print(f"  Zero Risk: {stats['zero_risk_areas']:,} areas ({stats['zero_risk_areas']/stats['total_areas']*100:.1f}%)")
    print("="*50)
    
    return stats

def main():
    """Main function to run all heatmap visualizations."""
    # File paths
    input_file = 'kharkiv_mine_risk_leader_partitioned.json'
    
    try:
        # Load data
        geojson_data = load_geojson_data(input_file)
        risk_data = extract_risk_data(geojson_data)
        
        # Generate statistics
        stats = generate_risk_statistics(risk_data)
        
        # Create different types of heatmaps
        print(f"\nGenerating heatmap visualizations...")
        
        # 1. Static scatter heatmap
        create_static_heatmap(risk_data)
        
        # 2. Interpolated heatmap
        create_interpolated_heatmap(risk_data)
        
        # 3. Interactive heatmap
        create_interactive_heatmap(risk_data)
        
        # 4. Polygon-based heatmap (if geopandas is available)
        try:
            create_polygon_heatmap(geojson_data)
        except Exception as e:
            print(f"Could not create polygon heatmap: {e}")
        
        print(f"\n✅ All heatmaps generated successfully!")
        print(f"📊 Check the following files:")
        print(f"   • kharkiv_mine_risk_heatmap.png (static scatter)")
        print(f"   • kharkiv_interpolated_heatmap.png (interpolated)")
        print(f"   • kharkiv_interactive_heatmap.html (interactive)")
        print(f"   • kharkiv_polygon_heatmap.png (polygon-based)")
        
    except FileNotFoundError:
        print(f"❌ Error: Could not find file '{input_file}'")
        print("Make sure the file exists in the current directory.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 