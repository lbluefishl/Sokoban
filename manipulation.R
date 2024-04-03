library(lme4)
library(readxl)
library(lmerTest)
data <- read_excel("data.xlsm", sheet = "manipulation")
attach(data)
id <- as.factor(prolificPID)
condition <- as.factor(condition)
lm <- lmer(focus ~ condition + (1|id))
lm2 <- lmer(enjoy ~ condition + (1|id))
lm3 <- lmer(mw ~ condition + (1|id))
lm4 <- lmer(pw ~ condition + (1|id))
lm5 <- lmer(rd ~ condition + (1|id))
lm6 <- lmer(ra ~ condition + (1|id))

#mind wandering associated with solving?
lm7 <- glmer(completedLevel ~ mw + (1|id), family="binomial")

#new moves?
lm8 <- lmer(nm ~ condition + (1|id))