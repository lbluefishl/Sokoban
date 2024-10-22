utils::install.packages("lme4", type = "source")
install.packages("readxl")
install.packages('lmerTest')

library(lme4)
library(readxl)
library(lmerTest)
data <- read_excel("data.xlsx", sheet = "P4A")
attach(data)
id <- as.factor(prolificPID)
condition <- as.factor(condition)

# differences between two break conditions
#focused immersion
lm <- lmer(f ~ condition + (1|id))
summary(lm)

#enjoyment
lm2 <- lmer(e ~ condition + (1|id))
summary(lm2)

#mind wandering
lm3 <- lmer(mw ~ condition + sex + (1|id))
summary(lm3)

#working on puzzle during break
lm4 <- lmer(pw ~ condition + (1|id))
summary(lm4)

#mental resource difference (after - before)
lm5 <- lmer(rd ~ condition + (1|id))
summary(lm5)

#resource recovery
lm6 <- lmer(ra ~ condition + (1|id))
summary(lm6)

#mind wandering associated with solving?
lm7 <- glmer(completedLevel ~ mw + (1|id), family="binomial")
summary(lm7)

#new moves?
lm8 <- lmer(nm ~ condition + (1|id))
summary(lm8)
