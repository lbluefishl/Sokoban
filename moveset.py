from sklearn.cluster import AgglomerativeClustering
import numpy as np


#level5
movesets5 = [
"rrddlludrruullulduuurdddrrddlluådrruull",
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
movesets3 = [
     "rulurrrdlrdrruul", 
 "rulurrrdlrdrruul", 
 "uurrrddlurul", 
 "rrudlluurrrd", 
 "rluurrrddll", 
 "uurrrddlulurdluldrrr", 
 "rrururrddllul", 
 "rulurrrdlrdrruul", 
 "rulurrrdlrdrruul", 
 "rulurrldrldrrr", 
 "uurrrddluruldl", 
 "rrururrddllull", 
 "uurrrddlulurldr", 
 "rrudlluurrld", 
 "uurrdulldrrurrrddllullld", 
 "rulurrrdlrdrruul", 
 "rrul", 
 "rrrludl", 
 "rrudlluurrrlddrr", 
 "rrudlluurrrd", 
 "uurrdlr", 
 "rrururrddllu", 
 "rulurrrdlrdrruul", 
 "rulurrlddrrul", 
 "uurrrddlurul" 
]
#level8
movesets = [
 "rlddrur", 
 "rlddr", 
 "rdrrulldluuddd", 
 "drluurddurrdll", 
 "drluur", 
 "druu", 
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
 "rlddruuu", 
 "drurrdlldluuudrul", 
 "rrdldluuurdr", 
 "rrdldluuurdr", 
 "drruldluudrr", 
 "drruldluurdr", 
 "rlddruudrrulldluu", 
 "drurrdlldluuudrud", 
 "drurrdlluluurdldrddluuuddrrrulldlu", 
 "drurrdlluluurddr", 
 "drluur", 
 "rlddru", 
 "drurrdlluluurdldrddluuudrdrrulldlu", 
 "druluurdl", 
 "drurrdlluluurdldrddluuuddrrrulldlu", 
 "drruldluurdrr", 
 "rlddruu", 
 "rlddruu", 
 "druluurddr", 
 "drurrdl", 
 "drurrdlullddruruldluu", 
 "rlddru", 
 "rlddruu", 
 "rrdld", 
 "drluurddurrdllu", 
 "rlddruu", 
 "drurrdlluluurdldrddluuuddrrrulldlu", 
 "rrdldluuud", 
 "drluurdrr", 
 "drruldl", 
 "rlddruudrrulldluu", 
 "rlddruudrrull", 
 "rlddruur", 
 "druluurd", 
 "drurrdlldluuu", 
 "drurrdlluluurdldrddluuuddrrrulldlu", 
 "drruldluurd", 
 "drurrdlldlur", 
 "drrul", 
 "drluurddurrdllul", 
 "drurrdlluluurdldrddluuuddrrrulldlu", 
 "rdrrulldluurdld", 
 "drlurr", 
 "rrdldluuurdrd", 
 "drlurdrlur", 
 "drurrdlluluurdldrddluuuddrrrulldlu", 
 "rrdldluuu", 
 "rrdlru", 
 "rdlu", 
 "rrdldluuurdrdr", 
 "druudrrdlldluuur", 
 "rlddruudrrulldluudru", 
 "drrul", 
 "rrdldluuurdrdr", 
 "drruldluud", 
 "rdlu", 
 "drruldluurddrur", 
 "rrdldluuurdrd", 
 "rdrrulldld", 
 "drurrdlldluruuldrddluuu", 
 "drluuurddr", 
 "rdrrulldluudrdld", 
 "druluurddrr", 
 "rldrrlur", 
 "drruldluurdrr", 
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



# Apply Agglomerative Clustering
n_clusters = 15  # You can set a specific number of clusters if you prefer
agg_clustering = AgglomerativeClustering(n_clusters=n_clusters, metric='precomputed', linkage='average')
cluster_labels = agg_clustering.fit_predict(dist_matrix)

# Organize movesets by cluster
cluster_movesets = {}
for moveset, label in zip(movesets, cluster_labels):
    if label not in cluster_movesets:
        cluster_movesets[label] = []
    cluster_movesets[label].append(moveset)

# Print movesets sorted by cluster with a line break after each moveset
for cluster, movesets_in_cluster in cluster_movesets.items():
    sorted_movesets = sorted(movesets_in_cluster)
    print(f"Cluster {cluster}:")
    for moveset in sorted_movesets:
        print(moveset)
    print()  # Line break after each cluster

cluster_sum_differences = {}
for cluster, movesets_in_cluster in cluster_movesets.items():
    sum_difference_matrix = np.zeros(len(movesets_in_cluster))
    for i in range(len(movesets_in_cluster)):
        for j in range(i+1, len(movesets_in_cluster)):
            sum_difference_matrix[i] += distance(movesets_in_cluster[i], movesets_in_cluster[j])
            sum_difference_matrix[j] += distance(movesets_in_cluster[i], movesets_in_cluster[j])
    cluster_sum_differences[cluster] = sum(sum_difference_matrix)

for cluster, sum_difference in cluster_sum_differences.items():
    print(f"Cluster {cluster}: Sum of Difference Matrix: {sum_difference}")

total_sum = sum(cluster_sum_differences.values())
print(f"Total Sum of Difference Matrix for All Clusters: {total_sum/2}")