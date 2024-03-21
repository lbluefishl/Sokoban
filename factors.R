library(readxl)
data <- read_excel("pilotrawdata.xlsx", sheet = "factors578")
model <- factanal(data, factor=4)


library(psych)
alpha(data[,1:2])
