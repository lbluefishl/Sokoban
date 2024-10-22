install.packages("readxl")
install.packages("psych")

library(readxl)
library(psych)

data <- read_excel("data.xlsx", sheet = "P3A")

#remove prolific ID column
data <- data[ , -ncol(data)]

#confirmatory factor analysis with 6 factors
model <- factanal(data, factor=6)
model


#cronbach alphas

#aha! experience
alpha(data[,1:3])

#new moves
alpha(data[,4:6])

#enjoyment
alpha(data[,7:9])

#focused immersion
alpha(data[,10:12])

#mind wandering
alpha(data[,13:15])

#mental resources
alpha(data[,16:21])