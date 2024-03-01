import psycopg2
import csv

def get_tracks_for_csv(limit, offset):
    conn = None
    try:
        conn = psycopg2.connect(
            dbname="sentirhy",
            user="owner",
            password="oaPBeAzranUQ",
            host="104.168.28.119"
        )
        cursor = conn.cursor()

        # Modify the query to select only title and spotifyURL
        cursor.execute("SELECT title, spotifyURL FROM sentirhy.tracks ORDER BY trackID LIMIT %s OFFSET %s", (limit, offset))
        
        # Fetch all rows
        tracks = cursor.fetchall()

        cursor.close()

        return tracks

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

# Fetch tracks for CSV
tracks_for_csv = get_tracks_for_csv(50, 0)  # Adjust limit and offset as needed

# Save to CSV file
with open('tracks.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['Title', 'Spotify URL'])  # Writing the header
    writer.writerows(tracks_for_csv)
