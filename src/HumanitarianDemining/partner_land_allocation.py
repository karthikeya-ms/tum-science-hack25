import geopandas as gpd
import matplotlib.pyplot as plt


# Configuration
input_path = "synthetic_kharkiv_mine_risk.json"
output_path = "synthetic_kharkiv_mine_risk_allocated.json"

# Partners and their resources
partners = [("A", 10000), ("B", 4000), ("C", 3000), ("D", 6000)]
# Normalize partner shares to sum to 1
total_resources = sum(share for _, share in partners)
partners = [(p, share / total_resources) for p, share in partners]

# Load the risk grid GeoJSON
mine_risk_gdf = gpd.read_file(input_path)

# Compute total risk
total_risk = mine_risk_gdf['risk'].sum()

# Calculate target risk per partner
partner_targets = {p: share * total_risk for p, share in partners}

# Add columns to track allocation
mine_risk_gdf['partner'] = None

# Extract centroid coordinates for sorting
mine_risk_gdf['centroid'] = mine_risk_gdf.geometry.centroid
mine_risk_gdf['centroid_x'] = mine_risk_gdf.centroid.x
mine_risk_gdf['centroid_y'] = mine_risk_gdf.centroid.y

# Sort cells by ascending y, then ascending x (bottom-left to top-right)
mine_risk_gdf = mine_risk_gdf.sort_values(by=['centroid_x', 'centroid_y']).reset_index(drop=True)

# Allocation loop
current_partner_idx = 0
allocated_risks = {p: 0 for p, _ in partners}

for idx, row in mine_risk_gdf.iterrows():
    p, share = partners[current_partner_idx]
    if allocated_risks[p] < partner_targets[p]:
        # Assign this cell to current partner
        mine_risk_gdf.at[idx, 'partner'] = p
        allocated_risks[p] += row['risk']
    else:
        # Move to next partner if exists
        current_partner_idx += 1
        if current_partner_idx >= len(partners):
            # All partners done, assign remaining cells to last partner
            mine_risk_gdf.at[idx, 'partner'] = partners[-1][0]
        else:
            p, share = partners[current_partner_idx]
            mine_risk_gdf.at[idx, 'partner'] = p
            allocated_risks[p] += row['risk']

# Cleanup auxiliary columns
mine_risk_gdf = mine_risk_gdf.drop(columns=['centroid', 'centroid_x', 'centroid_y'])

# Save output
mine_risk_gdf.to_file(output_path, driver='GeoJSON')

print(f"Allocation complete. Output saved to {output_path}")

# Filter only cells with risk > 0
gdf_nonzero = mine_risk_gdf[mine_risk_gdf['risk'] > 0]

# Plot
fig, ax = plt.subplots(figsize=(10, 10))
gdf_nonzero.plot(column='partner', categorical=True, legend=True, ax=ax,
                 cmap='Set2', edgecolor='black', linewidth=0.1)

plt.title("Landmine Risk Cells Allocated to Partners")
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.tight_layout()
plt.show()
