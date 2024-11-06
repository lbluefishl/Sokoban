utils::install.packages("lme4", type = "source")
install.packages("readxl")
install.packages('lmerTest')
install.packages("ggeffects")
install.packages("ggplot2")

library(readxl)
library(lme4)
library(lmerTest)
library(ggeffects)
library(dplyr)  
library(ggplot2)

data <- read_excel("data.xlsx", sheet = "P4")
attach(data)

level <- as.factor(levelNumber)
levels(level) <- c("hard", "easy", "medium")
level <- factor(level, levels = c("easy", "medium", "hard"))

condition <- as.factor(condition)
levels(condition) <- c("No Break", "Non-HIS Break", "HIS Break")

id <- as.factor(prolificPID)
sex <- as.factor(sex)
handedness <- as.factor(handedness)

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

lm <- glmer(completedLevel ~  level * condition + (1|id), family="binomial", control = glmerControl(optimizer = "bobyqa"))
summary(lm)


predictions <- ggpredict(lm, terms = c("level", "condition")) |> plot(colors = "bw")
 
# Plot the marginal effects
plot(predictions) +
     labs(title = "",
                  x = "Level Difficulty", y = "Predicted Probability of Completing Level")


data$levelNumber <- level
data$condition <- condition

interaction_plot <- data %>%
  group_by(condition, levelNumber) %>%
  summarise(prob_completed = mean(completedLevel, na.rm = TRUE), .groups = "drop") %>%
  ggplot(aes(x = levelNumber, y = prob_completed, shape = as.factor(condition), group = condition)) +  # Change 'color' to 'shape'
  geom_line() +
  geom_point(size = 3) +  # Adjust the point size if needed
  labs(title = "Interaction Plot of Condition and Level",
       x = "Level", y = "Proportion of Completed Levels") +
  theme_minimal() +
  scale_shape_manual(values = c(16, 17, 18))  # Customize shapes

interaction_plot