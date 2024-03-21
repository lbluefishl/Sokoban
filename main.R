library(readxl)
library(lme4)
library(lmerTest)
data <- read_excel("pilotrawdata.xlsx", sheet = "578trimmed")
attach(data)
level <- as.factor(level)
condition <- as.factor(condition)
id <- as.factor(prolificPID)

for (lvl in unique(level)) {
  data_level <- data[level == lvl, ]
  contingency_table <- table(data_level$completedLevel, data_level$condition)
  rownames(contingency_table) <- c("No", "Yes")  
  colnames(contingency_table) <- c("no break","non-HIS", "HIS")  
  chi_square_result <- chisq.test(contingency_table)
  cat("Chi-square test for Level", lvl, "\n")
  print(chi_square_result)
  cat("Contingency Table for Level", lvl, "\n")
  print(contingency_table)
}


model <- glmer(completedLevel ~ level*condition + (1|id), family="binomial")