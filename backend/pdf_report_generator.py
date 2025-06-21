
import pandas as pd
import matplotlib.pyplot as plt
from fpdf import FPDF
import seaborn as sns
from pathlib import Path

def create_pdf():
    # 1. Load Excel file
    asset_path = Path(__file__).parent.parent / "assets" 
    op_path = asset_path / "operator_monthly_example.xlsx"
    tl_path = asset_path / "teamlead_monthly_example.xlsx"

    # 2. Assume sheets
    df_operator = pd.read_excel(op_path, sheet_name=0)  # Sheet has: Month, Sector, Operator, MinesFound
    df_operator['Month'] = df_operator['Month'].dt.strftime('%Y-%m')  # Ensure Month is datetime type
    df_operator['Sector'] = df_operator['Sector'].astype(str)  # Ensure Sector is string type
    df_operator['Operator'] = df_operator['Operator'].astype(str)  # Ensure Operator is string type
    df_operator['MinesFound'] = df_operator['MinesFound'].fillna(0)  # Handle NaN values
    # x,y = df_operator.shape()  # Debugging line to check data

    df_teamlead = pd.read_excel(tl_path, sheet_name=0)  # Sheet has: Month, Operator, SectorAllotted
    df_teamlead['Month'] = df_teamlead['Month'].dt.strftime('%Y-%m')  # Ensure Month is datetime type
    df_teamlead['Operator'] = df_teamlead['Operator'].astype(str)  # Ensure Operator is string type 
    df_teamlead['SectorAllotted'] = df_teamlead['SectorAllotted'].astype(str)  # Ensure SectorAllotted is string type

    # 3. Aggregate Operator stats
    mines_by_sector = df_operator.groupby(['Month', 'Sector'])['MinesFound'].sum().unstack()
    mines_by_operator = df_operator.groupby(['Operator'])['MinesFound'].agg(['sum', 'mean', 'min', 'max'])

    # 4. Aggregate TeamLead stats
    assignments = df_teamlead.groupby(['Month', 'Operator']).count().unstack(fill_value=0)
    assignments.columns = assignments.columns.droplevel()

    # 5. Plot: Mines per Sector per Month
    plt.figure(figsize=(10, 6))
    mines_by_sector.plot(kind='bar', stacked=True)
    plt.title("Mines Found per Sector per Month")
    plt.xlabel("Month")
    plt.ylabel("Mines Found")
    plt.tight_layout()
    plt.savefig(asset_path / "bar_sector_month.png")
    plt.close()

    plt.figure(figsize=(10, 6))
    mines_by_operator.plot(kind='bar', y=['sum', 'mean', 'min', 'max'], rot=0)
    plt.title("Operator-wise Mines Statistics")
    plt.xlabel("Operator")
    plt.ylabel("Mines Found")
    plt.xticks(rotation=0)
    plt.legend(title="Statistic")
    plt.tight_layout()
    plt.savefig(asset_path / "mines_by_operator.png")
    plt.close()

    # 6. Plot: Operator Assignment Heatmap
    plt.figure(figsize=(8, 6))
    sns.heatmap(assignments, annot=True, cmap="YlGnBu", fmt='d')
    plt.title("Sector Assignments by TeamLead")
    plt.ylabel("Month")
    plt.tight_layout()
    plt.savefig(asset_path / "heatmap_assignments.png")
    plt.close()

    # 7. Create PDF
    final_path = asset_path / "ngo_activity_report.pdf"
    
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(0, 10, f"Comprehensive NGO Activity Report", ln=True, align='C')

    # 8. Summary
    pdf.set_font("Arial", '', 12)
    pdf.ln(10)
    pdf.cell(0, 10, f"Total Mines found: {int(df_operator['MinesFound'].sum())}", ln=True)
    pdf.cell(0, 10, f"Average Mines found per Month: {df_operator['MinesFound'].mean():.2f}", ln=True)
    pdf.cell(0, 10, f"Maximum Mines found in a Month: {df_operator['MinesFound'].max():.2f}", ln=True)
    pdf.cell(0, 10, f"Minimum Mines found in a Month: {df_operator['MinesFound'].min():.2f}", ln=True)

    # 9. Insert Bar Chart
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, "Mines Found per Sector", ln=True)
    pdf.image(str(asset_path / "bar_sector_month.png"), x=10, w=180)
    
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, "Operator-wise Mines Statistics", ln=True)
    pdf.image(str(asset_path / "mines_by_operator.png"), x=10, w=180)

    # 10. Insert Heatmap
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, "TeamLead Operator Assignments", ln=True)
    pdf.image(str(asset_path / "heatmap_assignments.png"), x=10, w=180)
    try:
        pdf.output(final_path)
    except Exception as e:
        raise Exception(f"Failed to generate PDF: {e}")
    return final_path