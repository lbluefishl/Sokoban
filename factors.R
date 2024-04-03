library(readxl)
data <- read_excel("data.xlsm", sheet = "factors na-rm")
model <- factanal(data, factor=6)


library(psych)
alpha(data[,1:3])
