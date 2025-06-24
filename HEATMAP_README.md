# Kharkiv Mine Risk Heatmap Visualization

This project provides comprehensive heatmap visualizations for the Kharkiv region mine risk data. The scripts process GeoJSON data from `kharkiv_mine_risk_leader_partitioned.json` and generate multiple types of heatmap visualizations.

## 📊 Generated Visualizations

The scripts generate **7 different visualizations** providing various perspectives on the mine risk data:

### Static Heatmaps (PNG files)
1. **kharkiv_simple_heatmap.png** - Basic scatter plot heatmap
2. **kharkiv_grid_heatmap.png** - Grid-based averaged heatmap  
3. **kharkiv_mine_risk_heatmap.png** - High-resolution scatter heatmap
4. **kharkiv_interpolated_heatmap.png** - Smooth interpolated surface
5. **kharkiv_polygon_heatmap.png** - Polygon boundary-based visualization
6. **kharkiv_risk_distribution.png** - Risk level distribution histogram

### Interactive Visualization
7. **kharkiv_interactive_heatmap.html** - Interactive web-based heatmap with zoom/pan capabilities

## 🚀 Quick Start

### Option 1: Simple Version (Basic Dependencies)
```bash
# Install basic requirements
pip install matplotlib numpy

# Run simple heatmap generator
python3 kharkiv_simple_heatmap.py
```

### Option 2: Advanced Version (Full Features)
```bash
# Install all dependencies
pip install -r requirements.txt

# Run advanced heatmap generator
python3 kharkiv_heatmap.py
```

## 📋 Requirements

### Basic Requirements (Simple Version)
- Python 3.7+
- matplotlib
- numpy
- json (built-in)

### Advanced Requirements (Full Version)
- numpy>=1.21.0
- pandas>=1.3.0
- matplotlib>=3.5.0
- seaborn>=0.11.0
- folium>=0.12.0
- geopandas>=0.10.0
- shapely>=1.8.0
- scipy>=1.7.0

## 📈 Data Analysis Results

### Dataset Overview
- **Total Areas Analyzed**: 25,221 polygons
- **Geographic Coverage**: Complete Kharkiv region
- **Risk Range**: 0.000 - 1.000
- **Mean Risk Level**: 0.210
- **Median Risk Level**: 0.000

### Risk Distribution
- 🟢 **Zero Risk (0.0)**: 14,693 areas (58.3%)
- 🟡 **Very Low Risk (0.0-0.2)**: 636 areas (2.5%)
- 🟠 **Low Risk (0.2-0.4)**: 2,610 areas (10.3%)
- 🟠 **Medium Risk (0.4-0.6)**: 4,019 areas (15.9%)
- 🔴 **High Risk (0.6-0.8)**: 2,547 areas (10.1%)
- 🔴 **Very High Risk (>0.8)**: 716 areas (2.8%)

### Critical Assessment
- ⚠️ **High Risk Areas**: 3,263 (12.9%)
- ✅ **Safe Areas (≤0.2)**: 15,329 (60.8%)

## 🎯 Visualization Features

### Simple Heatmap (`kharkiv_simple_heatmap.py`)
- ✅ Basic scatter plot visualization
- ✅ Grid-based binning heatmap
- ✅ Risk distribution histogram
- ✅ Comprehensive statistical analysis
- ✅ Color-coded risk levels
- ✅ Progress indicators for large datasets

### Advanced Heatmap (`kharkiv_heatmap.py`)
- ✅ Multiple heatmap types (scatter, interpolated, polygon)
- ✅ Interactive web-based visualization with Folium
- ✅ High-resolution static outputs
- ✅ Smooth interpolation using cubic methods
- ✅ Geospatial polygon rendering
- ✅ Multiple tile layer options
- ✅ Advanced statistical analysis

## 🗂️ File Structure

```
.
├── kharkiv_mine_risk_leader_partitioned.json  # Input data file
├── kharkiv_simple_heatmap.py                  # Simple version script
├── kharkiv_heatmap.py                         # Advanced version script
├── requirements.txt                           # Python dependencies
├── HEATMAP_README.md                          # This documentation
│
├── Generated Output Files:
├── kharkiv_simple_heatmap.png                 # Basic scatter heatmap
├── kharkiv_grid_heatmap.png                   # Grid-based heatmap
├── kharkiv_risk_distribution.png              # Risk distribution plot
├── kharkiv_mine_risk_heatmap.png              # High-res scatter heatmap
├── kharkiv_interpolated_heatmap.png           # Interpolated surface
├── kharkiv_polygon_heatmap.png                # Polygon-based visualization
└── kharkiv_interactive_heatmap.html           # Interactive web map
```

## 🎨 Visualization Types Explained

### 1. Scatter Heatmap
- Plots each area as a colored point based on risk level
- Best for seeing exact data point locations
- Color scale: Yellow (low risk) → Red (high risk)

### 2. Grid Heatmap
- Divides region into grid cells and averages risk values
- Smoother visualization, better for pattern recognition
- Configurable grid resolution (default: 100×100)

### 3. Interpolated Heatmap
- Creates smooth surface using cubic interpolation
- Fills gaps between data points
- Best for continuous risk surface visualization

### 4. Polygon Heatmap
- Shows actual polygon boundaries from GeoJSON
- Most accurate representation of source data
- Uses GeoPandas for proper geospatial rendering

### 5. Interactive Heatmap
- Web-based map with zoom, pan, and layer controls
- Multiple base maps (OpenStreetMap, Satellite, Dark mode)
- Heat intensity based on risk levels

### 6. Risk Distribution
- Histogram showing frequency of different risk levels
- Color-coded bars by risk category
- Statistical markers (mean, median)

## 🛠️ Customization Options

### Color Schemes
Both scripts use the 'YlOrRd' (Yellow-Orange-Red) colormap by default, which is:
- Yellow: Low risk areas
- Orange: Medium risk areas  
- Red: High risk areas

### Grid Resolution
For grid-based heatmaps, you can modify the `grid_size` parameter:
```python
create_grid_heatmap(risk_data, grid_size=200)  # Higher resolution
```

### Output Quality
All static images are saved at 300 DPI for high-quality printing and presentations.

## 🚨 Troubleshooting

### Common Issues

1. **File Not Found Error**
   ```
   ❌ Error: File 'kharkiv_mine_risk_leader_partitioned.json' not found!
   ```
   - Ensure the JSON file is in the same directory as the script
   - Check file name spelling

2. **Memory Issues with Large Datasets**
   - The dataset contains 25,221+ polygons
   - For very large datasets, consider using the simple version
   - Reduce grid resolution if needed

3. **Missing Dependencies**
   ```bash
   pip install matplotlib numpy  # For simple version
   pip install -r requirements.txt  # For advanced version
   ```

4. **Display Issues on Headless Systems**
   - Comment out `plt.show()` lines for server environments
   - Images will still be saved to files

## 📊 Performance Notes

- **Simple script**: ~10-15 seconds processing time
- **Advanced script**: ~30-45 seconds processing time
- **Memory usage**: ~500MB-1GB depending on visualization type
- **Output file sizes**: 
  - PNG files: 150KB - 1.2MB
  - Interactive HTML: ~1.3MB

## 🎯 Use Cases

### Humanitarian Operations
- Identify high-risk zones for demining priorities
- Plan safe routes for humanitarian aid
- Assess risk levels for different operational areas

### Government Planning
- Regional safety assessments
- Resource allocation for demining operations
- Public safety communications

### Research and Analysis
- Spatial risk pattern analysis
- Statistical modeling validation
- Risk distribution studies

## 📞 Support

The scripts include comprehensive error handling and progress indicators. If you encounter issues:

1. Check that all required files are present
2. Verify Python package installations
3. Ensure sufficient system memory
4. Review error messages for specific guidance

## 🔄 Future Enhancements

Potential additions could include:
- Time-series analysis if temporal data becomes available
- Risk prediction modeling
- Export to additional formats (KML, Shapefile)
- Integration with web mapping services
- Real-time data updates

---

*Generated visualizations provide comprehensive analysis of mine risk distribution across the Kharkiv region for humanitarian demining operations.* 