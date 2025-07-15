install.packages('emmeans')
install.packages('lme4')
library(emmeans)
library(lme4)
library(readxl)

data <- read_excel("data.xlsx", sheet = "P2")
attach(data)
levels <- as.factor(levelNumber)
id <- as.factor(prolificPID)

#compare differences in levels
difficultyModel <- lm(difficultyValue ~ levels)
stuckModel <- lm(stuckValue ~ levels)

#pairwise comparisons of difficulty and stuck feeling
emmeans(difficultyModel, pairwise ~ levels)
emmeans(stuckModel, pairwise ~ levels)

