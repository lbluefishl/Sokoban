library(readr)
factors <- read_csv("factors.csv")
model <- factanal(factors, factor=4)


library(psych)
alpha(factors[,1:2])
alpha(factors[,3:4])