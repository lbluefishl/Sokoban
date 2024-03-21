library(readxl)
library(lme4)
library(lmerTest)
data <- read_excel("pilotrawdata.xlsx", sheet = "moveset")
attach(data)
level <- as.factor(level)
condition <- as.factor(condition)
id <- as.factor(prolificPID)
novel <- as.factor(novel)


contingency_table <- table(novel, condition)
rownames(contingency_table) <- c("No", "Yes")  
colnames(contingency_table) <- c("no break","non-HIS", "HIS")  
chi_square_result <- chisq.test(contingency_table)
cat("Chi-square test for Level", "lvl6", "\n")

print(chi_square_result)
print(contingency_table)


lm <- glmer(novel ~ condition + (1|id), family="binomial")