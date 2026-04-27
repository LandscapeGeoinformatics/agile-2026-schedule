#!/usr/bin/env python3
import json
import sys
from pathlib import Path
import pandas as pd

def sanitize_key(room_name):
    """
    Convert room name to a valid key format 
        (lowercase, replace spaces/special chars with underscore)
    """
    return room_name.lower().replace(' ', '_').replace('-', '_')

def read_schedule_csv(file_path):
    """
    Read schedule file (Excel format) and return as pandas DataFrame
    """
    file_path = Path(file_path)
    
    try:
        df = pd.read_excel(file_path, dtype=str)
        df = df.fillna('')
        if df.empty:
            print(f"Error: File is empty")
            sys.exit(1)
        return df
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

def generate_events_config(df):
    """
    Generate events from a DataFrame
    
    Args:
        df: pandas DataFrame
        
    Returns:
        list of event dicts
    """
    events = []
    
    for idx, row in df.iterrows():
        # Extract columns with col_ prefix
        col_day = row.get('Day', '')
        col_start_time = row.get('Start Time', '')
        col_end_time = row.get('End Time', '')
        col_type = row.get('Type', '').strip().lower()
        col_title = row.get('Title', '').strip()
        col_author = row.get('Author(s)', '').strip()
        col_room = row.get('Room', '').strip()
        col_track = row.get('Track', '').strip()
        col_directions = row.get('Directions', '').strip()
        
        # Workshop columns
        col_short_title = row.get('Short title', '').strip()
        col_website = row.get('Website', '').strip()
        col_venue_webpage = row.get('Venue Webpage', '').strip()
        
        # Conference columns
        col_session_category = row.get('Session category', '').strip()
        
        # Convert to datetime and format as ISO 8601
        start_dt = ''
        end_dt = ''
        
        try:
            day_dt = pd.to_datetime(col_day).date()
            start_time_dt = pd.to_datetime(col_start_time).time()
            start_dt = f"{day_dt}T{start_time_dt.strftime('%H:%M')}"
        except Exception as e:
            print(f"Warning: Failed to parse start datetime for '{col_title}': {e}")
        
        try:
            day_dt = pd.to_datetime(col_day).date()
            end_time_dt = pd.to_datetime(col_end_time).time()
            end_dt = f"{day_dt}T{end_time_dt.strftime('%H:%M')}"
        except Exception as e:
            print(f"Warning: Failed to parse end datetime for '{col_title}': {e}")
        
        # Skip if we couldn't parse any critical fields
        if not col_title or (not start_dt and not end_dt):
            continue

        # Sanitze track
        if start_dt and '06-19' in start_dt:
            track = ''
        else:
            track = sanitize_key(col_track) if col_track else ''

        if col_type in ['workshop', 'workshop-continued', 'tutorial', 'tutorial-continued']:
            is_continued = True if '-continued' in col_type else False
            col_type = col_type.split("-")[0]
            theme = {
                'workshop': 'workshop-1565c0',
                'tutorial': 'workshop-f57f17',
            }
            theme = theme.get(col_type, "")
            author = [a.strip() for a in col_author.replace(' and ', ',').split(',') if a.strip()] if col_author else []
            
            event = {
                'event_group': 'workshop',
                'event_format': col_type,
                'is_continued': is_continued,
                'track': track,
                'theme': theme,
                'title': col_title,
                'short_title': col_short_title,
                'author': author,
                'location': col_room,
                'time_start': start_dt,
                'time_end': end_dt,
                'description': '',
                'website': col_website
            }
            events.append(event)
        
        elif col_type in ['break']:
            event = {
                'event_group': 'break',
                'event_format': col_type,
                'track': "",
                'title': col_title,
                'time_start': start_dt,
                'time_end': end_dt
            }
            events.append(event)

        elif col_type in ['end']:
            event = {
                'event_group': 'milestone',
                'event_format': 'milestone',
                'track': "",
                'title': col_title,
                'time_start': start_dt,
                'time_end': ''
            }
            events.append(event)

        elif col_type in ['social']:
            theme = {
                'social': 'social-ffffff'
            }
            theme = theme.get(col_type, '')
            event = {
                'event_group': 'social',
                'event_format': col_type,
                'track': '',
                'theme': theme,
                'title': col_title,
                'location': col_room,
                'webpage': col_venue_webpage,
                'directions': col_directions,
                'time_start': start_dt,
                'time_end': end_dt
            }
            events.append(event)

        elif col_type in ['assembly']:
            theme = {
                'assembly': 'assembly-1a3a4a'
            }
            theme = theme.get(col_type, '')
            event = {
                'event_group': 'assembly',
                'event_format': col_type,
                'track': '',
                'theme': theme,
                'title': col_title,
                'location': col_room,
                'time_start': start_dt,
                'time_end': end_dt
            }
            events.append(event)

        elif col_type in ['announcement']:
            theme = {
                'announcement': 'keynote-c00000',
            }
            theme = theme.get(col_type, '')
            event = {
                'event_group': 'announcement',
                'event_format': col_type,
                'track': '',
                'theme': theme,
                'title': col_title,
                'location': col_room,
                'time_start': start_dt,
                'time_end': end_dt
            }
            events.append(event)

        elif col_type in ['networking']:
            theme = {
                'networking': 'networking-ffc000'
            }
            theme = theme.get(col_type, '')

            event = {
                'event_group': 'social',
                'event_format': col_type,
                'track': track,
                'session_category': col_session_category,
                'theme': theme,
                'title': col_title,
                'location': col_room,
                'time_start': start_dt,
                'time_end': end_dt
            }
            events.append(event)

        elif col_type in ['posters', 'opening', 'keynote']:
            theme = {
                'keynote': 'keynote-c00000',
                'opening': 'opening-ffc000',
                'posters': 'networking-ffc000'
            }
            theme = theme.get(col_type, '')
            author = [a.strip() for a in col_author.replace(' and ', ',').split(',') if a.strip()] if col_author else []

            event = {
                'event_group': 'social',
                'event_format': col_type,
                'track': '',
                'session_category': col_session_category,
                'theme': theme,
                'title': col_title,
                'author': author,
                'location': col_room,
                'time_start': start_dt,
                'time_end': end_dt
            }
            events.append(event)
        
        elif col_type in ['presentation']:
            theme = {
                'LiDAR & 3D Geospatial Analysis': 'presentation-5d95d5',
                'Place Semantics & Spatial Knowledge Representation': 'presentation-8b3a3a',
                'Mobility Tracking & Travel Behaviour Analysis': 'presentation-65528f',
                'Ecology & Sustainable Systems Modelling': 'presentation-3c7d22',
                'Education track': 'presentation-e67e22',
                'Foundation Models & Generalisable GeoAI': 'presentation-3d6fa3',
                'Urban Morphology & Built Environment Analytics': 'presentation-56616c',
                'Transport Accessibility & Active Mobility': 'presentation-7b66a8',
                'Spatial Machine Learning & Predictive Analytics': 'presentation-4d82bc',
                'Street-Level Vision & Urban Environmental Perception': 'presentation-85929e',
                'Public Health & Urban Vulnerability': 'presentation-753131',
                'Remote Sensing for Environmental Hazards': 'presentation-275317',
                'Spatial Data Infrastructure & Scalable Analytics': 'presentation-2e5c8a',
                'Participatory Mapping & Planning': 'presentation-d28f7b',
                'Posters, Networking, Welcome, Closing': 'presentation-f57f17',
                'Best Paper Competition': 'presentation-f57f17'
            }
            theme = theme.get(col_session_category, '')
            author = [a.strip() for a in col_author.replace(' and ', ',').split(',') if a.strip()] if col_author else []

            event = {
                'event_group': 'presentation',
                'event_format': col_type,
                'session_category': col_session_category,
                'track': track,
                'theme': theme,
                'title': col_title,
                'author': author,
                'location': col_room,
                'time_start': start_dt,
                'time_end': end_dt,
            }
            events.append(event)
    
    return events

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python events_prep.py -timetable_name1 file1.xlsx -timetable_name2 file2.xlsx ...")
        print("\nExample:")
        print("  python events_prep.py -main conference_schedule_web_long.xlsx -workshops workshops_schedule_web_long.xlsx")
        print("\nGenerates:")
        print("  - eventsConfig.js")
        sys.exit(1)
    
    # Parse command-line arguments for -timetable_name -file pairs
    files_dict = {}
    args = sys.argv[1:]
    
    i = 0
    while i < len(args):
        if args[i].startswith('-'):
            timetable_name = args[i][1:]  # Remove leading dash
            if i + 1 < len(args) and not args[i + 1].startswith('-'):
                csv_file = args[i + 1]
                df = read_schedule_csv(csv_file)
                files_dict[timetable_name] = df
                print(f"✓ Loaded '{timetable_name}' from {csv_file}")
                i += 2
            else:
                print(f"Error: No file provided for -{timetable_name}")
                sys.exit(1)
        else:
            print(f"Error: Expected -timetable_name, got {args[i]}")
            sys.exit(1)
    
    if not files_dict:
        print("Error: No files provided")
        sys.exit(1)
    
    # Create barebone structures
    events_by_timetable = {}
    timetables_by_name = {}
    
    # Generate for each timetable
    for timetable_name, df in files_dict.items():
        events_by_timetable[timetable_name] = generate_events_config(df)
    
    # Write events config
    json_str = json.dumps(events_by_timetable, indent=2, ensure_ascii=False)
    js_code = f"export const eventsConfig = {json_str}\n"
    output_file = Path('eventsConfig.js')
    try:
        output_file.write_text(js_code, encoding='utf-8')
        total_events = sum(len(v) for v in events_by_timetable.values())
        print(f"✓ Generated {output_file}")
        print(f"  Found {total_events} events")
    except Exception as e:
        print(f"Error writing {output_file}: {e}")
        sys.exit(1)
