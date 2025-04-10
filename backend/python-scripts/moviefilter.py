#!/usr/bin/env python
# coding: utf-8

# **Data Understanding**

# In[32]:
import pandas as pd
import mysql.connector

conn = mysql.connector.connect(
    host='intex.c0cqkqn7fqob.us-east-1.rds.amazonaws.com',
    port=3306,
    database='Movies.db',
    user='admin',
    password='jJPERMquJTxDxHi0ydg0'
)

# Query the table and load it into a DataFrame
query = 'SELECT * FROM movie_users'
df_users = pd.read_sql(query, conn)

# Close the connection
conn.close()


# In[33]:


df_triple = pd.read_csv('C:/Users/dalle/OneDrive/Desktop/Dallen/BYU/Winter 2025/Intex2/Machine Learning/movies_ratings.csv')
df_triple.sort_values(by=['user_id', 'show_id', 'rating'], inplace=True) # This sorting will matter later when we clean the data
value_counts = df_triple['show_id'].value_counts()
keep_list = value_counts[value_counts >= 1]
df_triple_filtered = df_triple.loc[df_triple['show_id'].isin(keep_list.index)]


# In[34]:


conn = mysql.connector.connect(
    host='intex.c0cqkqn7fqob.us-east-1.rds.amazonaws.com',
    port=3306,
    database='Movies.db',
    user='admin',
    password='jJPERMquJTxDxHi0ydg0'
)

# Query the table and load it into a DataFrame
query = 'SELECT * FROM movie_titles'
df_movies = pd.read_sql(query, conn)

# Close the connection
conn.close()


# In[35]:


conn = mysql.connector.connect(
    host='intex.c0cqkqn7fqob.us-east-1.rds.amazonaws.com',
    port=3306,
    database='Movies.db',
    user='admin',
    password='jJPERMquJTxDxHi0ydg0'
)

# Query the table and load it into a DataFrame
query = 'SELECT * FROM movie_titles'
df = pd.read_sql(query, conn)

# Close the connection
conn.close()
print(df.isna().sum(), '\n')
print(df.shape)
df.head()


# **Data Cleaning**

# In[ ]:


print(f"Duplicate ratings: {df_triple_filtered.duplicated(subset=['show_id', 'description']).sum()}")
df_triple.drop_duplicates(subset=['show_id', 'description'], keep='first', inplace=True)


# In[ ]:


df.director.fillna('placeholder123', inplace=True)
df.cast.fillna('placeholder123', inplace=True)
df.country.fillna('placeholder123', inplace=True)
df.rating.fillna('placeholder123', inplace=True)
df.duration.fillna('placeholder123', inplace=True)

# Very important step
df.reset_index(inplace=True)

print(df.isna().sum(), '\n')
df.shape


# **Content Filtering Algorithm**

# In[37]:


from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.metrics.pairwise import cosine_similarity

# Create a TF-IDF vectorizer and compute the TF-IDF matrix
custom_stop_words = ENGLISH_STOP_WORDS.union({'placeholder123', 'season', 'episode', 'series', 'film', 'movie', 'based'})
tfidf = TfidfVectorizer(stop_words=list(custom_stop_words))
df['combined'] = df['description'].fillna('') + ' ' + df['director'].fillna('') + ' ' + df['type'].fillna('') + ' ' + df['rating'].fillna('')
tfidf_matrix = tfidf.fit_transform(df['combined'])

# Compute the cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Define the RecommendationSystem class (if not already defined)
class RecommendationSystem:
    def __init__(self, sim_matrix, df):
        self.sim_matrix = sim_matrix
        self.df = df

# Initialize the recommendation system
rec_system = RecommendationSystem(cosine_sim, df)


# **Content Filtering (movies like this)**

# In[38]:


import sqlite3
# Create a list to store the recommendations
recommendations_list = []

# Create a mapping between content IDs and their positions in the similarity matrix
unique_show_ids = rec_system.df['show_id'].unique()
show_id_to_index = {id: idx for idx, id in enumerate(unique_show_ids)}
index_to_show_id = {idx: id for idx, id in enumerate(unique_show_ids)}

# Modify your get_recommendations function to use the mapping 
def get_mapped_recommendations(show_id, n=10, content_type=None):
    try:
        # Convert content ID to matrix index
        if show_id not in show_id_to_index:
            print(f"Item {show_id} is not in the similarity matrix you provided")
            return None

        matrix_idx = show_id_to_index[show_id]

        # Get similarity scores
        sim_scores = list(enumerate(rec_system.sim_matrix[matrix_idx]))

        # Sort the items based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        if content_type:
        # Skip the first one (itself) and collect items matching the requested type
            filtered_scores = []
            for idx, score in sim_scores[1:]:
                if df.loc[idx, 'type'] == content_type:
                    filtered_scores.append((idx, score))

            # Break once we have enough recommendations
                if len(filtered_scores) >= n:
                    break

            sim_scores = filtered_scores[:n]  # Take at most n items
        else:
            # Get the scores of the n most similar items; start at 1 so that it skips itself
            sim_scores = sim_scores[1:n+1]



        # Get the item indices
        item_indices = [i[0] for i in sim_scores]

        # Map indices back to content IDs
        recommended_ids = [index_to_show_id[idx] for idx in item_indices]

        return recommended_ids
    except Exception as e:
        print(f"Error processing content ID {show_id}: {e}")
        return None

# Iterate through all content IDs in the dataset
for show_id in unique_show_ids:
    # Get recommendations for the current content ID
    recommended_ids = get_mapped_recommendations(show_id, n=10, content_type='Movie')

    if recommended_ids is not None:
        # Ensure there are exactly 5 recommendations (fill with empty strings if fewer)
        while len(recommended_ids) < 5:
            recommended_ids.append("")

        # Add the content ID and its recommendations to the list
        recommendations_list.append({
            'showId': show_id,
            'recommendation_1': recommended_ids[0],
            'recommendation_2': recommended_ids[1],
            'recommendation_3': recommended_ids[2],
            'recommendation_4': recommended_ids[3],
            'recommendation_5': recommended_ids[4],
            'recommendation_6': recommended_ids[5], 
            'recommendation_7': recommended_ids[6],
            'recommendation_8': recommended_ids[7],
            'recommendation_9': recommended_ids[8],
            'recommendation_10': recommended_ids[9]
        })

# Convert the recommendations list to a DataFrame
recommendations_df = pd.DataFrame(recommendations_list)

# Save the recommendations DataFrame to a CSV file
conn = sqlite3.connect('MovieRecommendByShowID.sqlite')
recommendations_df.to_sql('movieRecommendations', conn, index=False, if_exists='replace')
conn.close()


# **Content Filtering (movies like this)**

# In[39]:


import sqlite3
# Create a list to store the recommendations
recommendations_list = []

# Create a mapping between content IDs and their positions in the similarity matrix
unique_show_ids = rec_system.df['show_id'].unique()
show_id_to_index = {id: idx for idx, id in enumerate(unique_show_ids)}
index_to_show_id = {idx: id for idx, id in enumerate(unique_show_ids)}

# Modify your get_recommendations function to use the mapping 
def get_mapped_recommendations(show_id, n=10, content_type=None):
    try:
        # Convert content ID to matrix index
        if show_id not in show_id_to_index:
            print(f"Item {show_id} is not in the similarity matrix you provided")
            return None

        matrix_idx = show_id_to_index[show_id]

        # Get similarity scores
        sim_scores = list(enumerate(rec_system.sim_matrix[matrix_idx]))

        # Sort the items based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        if content_type:
        # Skip the first one (itself) and collect items matching the requested type
            filtered_scores = []
            for idx, score in sim_scores[1:]:
                if df.loc[idx, 'type'] == content_type:
                    filtered_scores.append((idx, score))

            # Break once we have enough recommendations
                if len(filtered_scores) >= n:
                    break

            sim_scores = filtered_scores[:n]  # Take at most n items
        else:
            # Get the scores of the n most similar items; start at 1 so that it skips itself
            sim_scores = sim_scores[1:n+1]



        # Get the item indices
        item_indices = [i[0] for i in sim_scores]

        # Map indices back to content IDs
        recommended_ids = [index_to_show_id[idx] for idx in item_indices]

        return recommended_ids
    except Exception as e:
        print(f"Error processing content ID {show_id}: {e}")
        return None

# Iterate through all content IDs in the dataset
for show_id in unique_show_ids:
    # Get recommendations for the current content ID
    recommended_ids = get_mapped_recommendations(show_id, n=10, content_type='TV Show')

    if recommended_ids is not None:
        # Ensure there are exactly 5 recommendations (fill with empty strings if fewer)
        while len(recommended_ids) < 5:
            recommended_ids.append("")

        # Add the content ID and its recommendations to the list
        recommendations_list.append({
            'showId': show_id,
            'recommendation_1': recommended_ids[0],
            'recommendation_2': recommended_ids[1],
            'recommendation_3': recommended_ids[2],
            'recommendation_4': recommended_ids[3],
            'recommendation_5': recommended_ids[4],
            'recommendation_6': recommended_ids[5], 
            'recommendation_7': recommended_ids[6],
            'recommendation_8': recommended_ids[7],
            'recommendation_9': recommended_ids[8],
            'recommendation_10': recommended_ids[9]
        })

# Convert the recommendations list to a DataFrame
recommendations_df = pd.DataFrame(recommendations_list)

# Save the recommendations DataFrame to a CSV file
conn = sqlite3.connect('TVRecommendByShowID.sqlite')
recommendations_df.to_sql('tvRecommendations', conn, index=False, if_exists='replace')
conn.close()


# **Filter by User ID**

# In[40]:


import sqlite3
import pandas as pd

# Create a list to store the recommendations
recommendations_list = []

# Create a mapping between content IDs and their positions in the similarity matrix
unique_show_ids = rec_system.df['show_id'].unique()
show_id_to_index = {id: idx for idx, id in enumerate(unique_show_ids)}
index_to_show_id = {idx: id for idx, id in enumerate(unique_show_ids)}

# Modify your get_recommendations function to use the mapping 
def get_mapped_recommendations(show_id, n=10, content_type=None):
    try:
        # Convert content ID to matrix index
        if show_id not in show_id_to_index:
            print(f"Item {show_id} is not in the similarity matrix you provided")
            return None

        matrix_idx = show_id_to_index[show_id]

        # Get similarity scores
        sim_scores = list(enumerate(rec_system.sim_matrix[matrix_idx]))

        # Sort the items based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        if content_type:
            # Skip the first one (itself) and collect items matching the requested type
            filtered_scores = []
            for idx, score in sim_scores[1:]:
                if df.loc[idx, 'type'] == content_type:
                    filtered_scores.append((idx, score))

                # Break once we have enough recommendations
                if len(filtered_scores) >= n:
                    break

            sim_scores = filtered_scores[:n]  # Take at most n items
        else:
            # Get the scores of the n most similar items; start at 1 so that it skips itself
            sim_scores = sim_scores[1:n+1]

        # Get the item indices
        item_indices = [i[0] for i in sim_scores]

        # Map indices back to content IDs
        recommended_ids = [index_to_show_id[idx] for idx in item_indices]

        return recommended_ids
    except Exception as e:
        print(f"Error processing content ID {show_id}: {e}")
        return None

# Iterate through each user to get recommendations based on their top-rated movies
for user_id in df_triple_filtered['user_id'].unique():
    # Filter the data by only those movies rated by this user
    df_user_ratings = df_triple_filtered[df_triple_filtered['user_id'] == user_id]

    # Find the maximum rating for this user
    max_rating = df_user_ratings['rating'].max()

    # Get all movies with the max rating for the user (some users may have multiple)
    df_favorites = df_user_ratings[df_user_ratings['rating'] == max_rating]['show_id']

    # For each top-rated movie, get recommendations
    for movie_id in df_favorites:
        # Get recommendations based on the top-rated movie
        recommended_ids = get_mapped_recommendations(movie_id, n=10)

        if recommended_ids is not None:
            # Ensure there are exactly 10 recommendations (fill with empty strings if fewer)
            while len(recommended_ids) < 10:
                recommended_ids.append("")

            # Add the user's recommendations to the list
            recommendations_list.append({
                'user_id': user_id,
                'show_id': movie_id,
                'recommendation_1': recommended_ids[0],
                'recommendation_2': recommended_ids[1],
                'recommendation_3': recommended_ids[2],
                'recommendation_4': recommended_ids[3],
                'recommendation_5': recommended_ids[4],
                'recommendation_6': recommended_ids[5],
                'recommendation_7': recommended_ids[6],
                'recommendation_8': recommended_ids[7],
                'recommendation_9': recommended_ids[8],
                'recommendation_10': recommended_ids[9]
            })

# Convert the recommendations list to a DataFrame
recommendations_df = pd.DataFrame(recommendations_list)

# Save the recommendations DataFrame to a SQLite database
conn = sqlite3.connect('ShowRecommendByUserID.sqlite')
recommendations_df.to_sql('userRecommendations', conn, index=False, if_exists='replace')
conn.close()

