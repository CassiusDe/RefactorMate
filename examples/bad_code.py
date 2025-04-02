# Example Python code with issues

def process_user_with_many_params(first_name, last_name, email, phone, address, city, state, zip_code, country):
    """Function with too many parameters"""
    print(f"Processing user: {first_name} {last_name}")
    return {
        'full_name': f"{first_name} {last_name}",
        'contact': email,
        'location': f"{address}, {city}, {state} {zip_code}, {country}"
    }

def very_long_python_method():
    """This method is way too long and does too many things"""
    print("Starting complex Python operation")
    data = []

    # Generate some data
    for i in range(100):
        data.append(i * 2)

    print("Generated initial data")

    # Filter data
    filtered_data = [x for x in data if x > 50]
    print(f"Filtered to {len(filtered_data)} items")

    # Transform data
    transformed = []
    for item in filtered_data:
        transformed.append({
            'value': item,
            'squared': item ** 2,
            'cubed': item ** 3,
            'is_even': item % 2 == 0
        })

    print("Transformed data structure")

    # Categorize
    even_items = [x for x in transformed if x['is_even']]
    odd_items = [x for x in transformed if not x['is_even']]

    print(f"Categorized: {len(even_items)} even, {len(odd_items)} odd")

    # Calculate statistics
    total_value = sum(x['value'] for x in transformed)
    avg_value = total_value / len(transformed) if transformed else 0
    max_value = max(x['value'] for x in transformed) if transformed else 0
    min_value = min(x['value'] for x in transformed) if transformed else 0

    print(f"Statistics calculated: avg={avg_value}, max={max_value}, min={min_value}")

    # Generate report
    report = {
        'data': {
            'even': even_items,
            'odd': odd_items,
            'all': transformed
        },
        'stats': {
            'total_count': len(transformed),
            'even_count': len(even_items),
            'odd_count': len(odd_items),
            'total_value': total_value,
            'average': avg_value,
            'maximum': max_value,
            'minimum': min_value
        },
        'metadata': {
            'processed': True,
            'method': 'very_long_python_method',
            'version': '1.0'
        }
    }

    print("Report generated successfully")
    return report