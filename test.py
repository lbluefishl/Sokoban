from sklearn.cluster import AgglomerativeClustering
import numpy as np
from collections import defaultdict

#lvl5
movesets = [
"rrddlludrruullulduuurdddrrddlludrruull",
"rrddllulurluurdddur",
"rrddllulurluurddld",
"rrddlludrruulluluurdddrrddlluluuddrdrruulluldruuuld",
"rrddlludrruulluluurddd",
"udrrddlludrruullulduuurdd",
"rrddlludrruullulduuurdddd",
"uldrrrddlludrruulldluruu",
"udrrddlludrruulluluurddduldrrrddllud",
"udrrddlludrruulluluurdddu",
"rrddlludrruullulduuurddldrr",
"rrddlludrruullulduuurdddrrddlluu",
"rrddlludrruulluluurddduldrrrddllud",
"rrddlludrruulldluruuldduuu",
"rrddlludrruullulduuurddld",
"uldrrrddlludrruullulduuurdddrrddlluu",
"rrddlludrruulluddluuudru",
"rrddlludrruulldluu",
"rrddlludrruulldlur",
"rrddlludrruulldluu",
"rrddlludrruullulduuurdddrrddllu",
"rrddlludrruulldluudrd",
"rrddlludrruulluluurdldduurddrrddlludr",
"rrddlludrruulluluurddldrddrruulrddlluuluurd",
"rrddlludrruulluluurdddrrddllulurr",
"rrddlludrruulluddluru",
"rrddlludrruulldluudr",
"rrddllulurluurdd",
"rrddlludrruulldluuurduu",
"udrrddlludrruulluluurdddrrddllulurludrddrruulluldruuuld",
"rrddlludrruullulduuurdddrrddlludrruulldd",
"udrrddlludrruullulduuurddldrddrruulrddlluul",
"rrddlludrruulluluurdddrrddlluluuddrdrruulluldruuuld",
"uuldrdl",
"rrddllulurluurdl",
"rrddlludrruulluddluru"

]
#level6
movesets6 = [
     "uluuldurrd", 
 "ldluruuurd", 
 "ulldruuurdlddrrullu", 
 "ulldrrluuur", 
 "ullddruluruuldrddrruldluuldd", 
 "uluurdldrllddruluruuldrddrr", 
 "ullddru", 
 "luuuldrdddl", 
 "uluuldr", 
 "uluurddllddruuu", 
 "uluurdldld", 
 "uluurdluldrdrdrruldl", 
 "uluurdldrlldr", 
 "ullddruuu", 
 "ldlur", 
 "uluuldrurdlddrruldluuddld", 
 "luuurddrdluuldlu", 
 "uluurdld", 
 "uluurdldld", 
 "ullddruu", 
 "uluurdluldrdrdrrullul", 
 "uluuldrurdllddrruluurddll", 
 "ullddruruluurddrdluluurd", 
 "ullddruuu", 
 "luuurddrdlu", 
 "uluuldurrdlddru", 
 "uluul", 
 "luuurdlddrruldluud", 
 "luuuldrdddl", 
 "uluul", 
 "ullddrur", 
 "uluurdldlddruuu", 
 "luuuldrurdlddrruldluudd", 
 "lulur", 
 "uluuldr", 
 "uluurdluldrrdr", 
 "uluuldurrdld", 
 "ulldrrluuuldrurdlddrruldluu", 
 "uluurdldldrruluur", 
 "ulldruuurdldrl", 
 "ldlururulu", 
 "uluuldurrdld", 
 "luuurdlddrrululdlur", 
 "ullddru", 
 "uluurdldldrr", 
 "uululdrr", 
 "uluuldrd", 
 "ullddruuud", 
 "uluurdluldrd", 
 "uluuldrurdld", 
 "ullddruuu", 
 "uluuldrurdldrdrrulldluul", 
 "uluurdluldrdrdrruldl", 
 "uluurdldrlldr", 
 "ullddruuu", 
 "lurul", 
 "uluurdl", 
 "uluurdduldlddruuudl"
]
#level7
movesets = [
"rulurrrdlrdrruul", 
"uurrrddlurul", 
"rrudlluurrrd", 
"rluurrrddll", 
"uurrrddlulurdluldrrr", 
"rrururrddllul", 
"rulurrldrldrrr", 
"uurrrddluruldl", 
"rrururrddllull", 
"uurrrddlulurldr", 
"rrudlluurrld", 
"uurrdulldrrurrrddllullld", 
"rrrludl", 
"rrudlluurrrlddrr", 
"uurrdlr", 
"rrururrddllu", 
"rulurrlddrrul", 
"uurrrddlurul" 

]

#level8
movesets8 = [
"rlddrur", 
"rlddr", 
"rdrrulldluuddd", 
"drluurddurrdll", 
"drluur", 
"rrdldluuudrr", 
"rrdldluuurdrd", 
"rlddruuu", 
"rlddruurludl", 
"rrdldluuuddrrulu", 
"drruldluudr", 
"rlddru", 
"drurrdlldluuud", 
"drruldluu", 
"drurrdlldluuudrud", 
"rldrrlul", 
"drluurdrrd", 
"drurrdlldluuudrul", 
"rrdldluuurdr", 
"drruldluudrr", 
"drruldluurdr", 
"rlddruudrrulldluu", 
"drurrdlluluurdldrddluuuddrrrulldlu", 
"drurrdlluluurddr", 
"drurrdlluluurdldrddluuudrdrrulldlu", 
"druluurdl", 
"drruldluurdrr", 
"rlddruu", 
"druluurddr", 
"drurrdl", 
"drurrdlullddruruldluu", 
"rrdld", 
"drluurddurrdllu", 
"rrdldluuud", 
"drluurdrr", 
"drruldl", 
"rlddruudrrull", 
"rlddruur", 
"druluurd", 
"drurrdlldluuu", 
"drruldluurd", 
"drurrdlldlur", 
"drrul", 
"drluurddurrdllul", 
"rdrrulldluurdld", 
"drlurr", 
"drlurdrlur", 
"rrdldluuu", 
"rrdlru", 
"rrdldluuurdrdr", 
"druudrrdlldluuur", 
"rlddruudrrulldluudru", 
"drruldluud", 
"drruldluurddrur", 
"rdrrulldld", 
"drurrdlldluruuldrddluuu", 
"drluuurddr", 
"rdrrulldluudrdld", 
"druluurddrr", 
"rldrrlur"
]

# Define custom distance metric
def distance(moveset1, moveset2):
    common_positions = min(len(moveset1), len(moveset2))
    num_differences = sum(1 for i in range(common_positions) if moveset1[i] != moveset2[i])
    min_length = min(len(moveset1), len(moveset2))
    proportion_difference = num_differences / min_length
    return proportion_difference

# Calculate distance matrix
n_movesets = len(movesets)
dist_matrix = np.zeros((len(movesets), len(movesets)))
for i in range(len(movesets)):
    for j in range(i+1, len(movesets)):
        dist_matrix[i, j] = distance(movesets[i], movesets[j])

print(dist_matrix)

cluster_sum_distances = defaultdict(list)
for n_clusters in range(1, n_movesets + 1):
    # Apply Agglomerative Clustering
    agg_clustering = AgglomerativeClustering(n_clusters=n_clusters, metric='precomputed', linkage='average')
    cluster_labels = agg_clustering.fit_predict(dist_matrix)

    # Calculate sum of distances within clusters
    cluster_distances = defaultdict(float)
    for i, label in enumerate(cluster_labels):
        cluster_distances[label] += dist_matrix[i][cluster_labels == label].sum()
    cluster_sum_distances[n_clusters].append(sum(cluster_distances.values()))

# Print distance matrix sum vs. number of clusters
for n_clusters, sum_distances in cluster_sum_distances.items():
    print(f"Number of Clusters: {n_clusters}, Distance Matrix Sum: {sum_distances[0]}")
