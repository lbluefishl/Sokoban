install.packages("corrplot")
install.packages("psych")
library(readxl)
library(corrplot)
library(psych)


data <- read_excel("data.xlsx", sheet = "P2A")

data$trialOrder <- as.factor(data$trialOrder)
data$conditionOrder <- as.factor(data$conditionOrder)

#order effects
result <- aov(data$completedLevels ~ trialOrder, data = data)
summary(result)

result2 <- aov(data$completedLevels ~ conditionOrder, data = data)
summary(result2)


#ignore 1 participant that answered other 
data1 <- data[data$sex != 2, ] 

#t-test for gender, handedness
data1$sex <- as.factor(data1$sex)
test1 <- t.test(data1$completedLevels ~ data1$sex, var.equal = TRUE)
test1

#ignore ambidextrous individuals
data2 <- data[data$handedness != 3, ]

data2$handedness <- as.factor(data2$handedness)
test2 <- t.test(data2$completedLevels ~ data2$handedness, var.equal = TRUE)
test2

#correlational analysis
data$sex <- as.numeric(as.character(data$sex))
data$handedness <- as.numeric(as.character(data$handedness))
data <- data[ ,2:10]

corm <- cor(data)
corrplot(corm)
corr.test(corm, use = "pairwise", method = "pearson")

write.csv(corm, "correlations.csv", row.names = FALSE)