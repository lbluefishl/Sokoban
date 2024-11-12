utils::install.packages("lme4", type = "source")
install.packages("readxl")
install.packages('lmerTest')
install.packages("ggeffects")
install.packages("ggplot2")

library(readxl)
library(lme4)
library(lmerTest)
library(ggeffects)
library(ggplot2)


data <- read_excel("data.xlsx", sheet = "P3B - final")


attach(data)

level <- as.factor(levelNumber)
levels(level) <- c("hard", "easy", "medium")
level <- factor(level, levels = c("easy", "medium", "hard"))
condition <- as.factor(condition)
levels(condition) <- c("No Break", "Non-HIS Break", "HIS Break")
id <- as.factor(prolificPID)



firstMoveNew <- as.factor(firstMoveNew)
differentFirstStrategy <- as.factor(differentFirstStrategy)
lengthBefore_scaled <- scale(moveBefore)


for (lvl in unique(level)) {
  data_level <- data[level == lvl, ]
  contingency_table <- table(data_level$firstMoveNew, data_level$condition)
  rownames(contingency_table) <- c("No", "Yes")  
  colnames(contingency_table) <- c("no break","non-HIS", "HIS")  
  chi_square_result <- chisq.test(contingency_table)
  cat("Chi-square test for Level", lvl, "\n")
  print(chi_square_result)
  cat("Contingency Table for Level", lvl, "\n")
  print(contingency_table)
}

lm <- glmer(firstMoveNew ~ condition * level + lengthBefore_scaled + (1 | id), family = "binomial", control = glmerControl(optimizer = "bobyqa"))
summary(lm)
lm2 <- glmer(differentFirstStrategy ~ condition * level + (1 | id), family = "binomial")
summary(lm2)


predictions <- ggpredict(lm, terms = c("level", "condition")) |> plot(colors = "bw")

# Plot the marginal effects
plot(predictions) +
  labs(title = "",
       x = "Level Difficulty", y = "Predicted Probability of New Strategy")

lm3 <- glmer(completedLevel ~ firstMoveNew*level + (1|id), family = "binomial")
summary(lm3)

#duration
data <- data[data$completedLevel == 1,]
lm8 <- lmer(data$totalTime ~ data$condition*data$level + (1|id))
summary(lm8)
