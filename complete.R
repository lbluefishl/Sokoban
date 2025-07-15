install.packages("lme4")
install.packages("readxl")
install.packages("tidyverse")
install.packages("psych")
install.packages('lmerTest')
install.packages('ggeffects')
install.packages("rmarkdown")

library(lme4)
library(readxl)
library(tidyverse)
library(psych)
library(lmerTest)
library(ggeffects)
library(rmarkdown)

#Load data and preprocessing
data <- read_excel("data.xlsx", sheet = "raw")
data <- data %>%
  mutate(prolificPID = factor(prolificPID),
         levelNumber = factor(levelNumber),
         condition = recode(condition,
            `1` = "No Break",
            `2` = "Non-HIS",
            `3` = "HIS"         
         ),
         condition = factor(condition, levels = c("No Break", "Non-HIS", "HIS"))
)

survey <- read_excel("data.xlsx", sheet = "survey")

##### EXCLUSIONS #####

# Did not complete full study or restarted study

problematic_ids <- data %>%
  group_by(prolificPID) %>%
  summarise(row_count = n()) %>%
  filter(row_count != 3) %>%
  pull(prolificPID)

data <- data %>%
  filter(!prolificPID %in% problematic_ids)

#### RELIABILITIES #####

# We obtain Cronbach's alpha for each construct by using each participant's first possible use of a corresponding scale during the first trial. This excludes people who completed the puzzle early on their first trial and those that are in the no break condition for the first puzzle. The trial order is taken from the survey tab to get the first level.    

items <- data %>%
  filter(completedEarly == 0, condition != "No Break") %>%      
  left_join(
    survey %>%
      mutate(first_trial = as.integer(substr(trialOrder, 1, 1))) %>%    
      select(prolificPID, first_trial),                                 
    by = "prolificPID"
  ) %>%
  filter(levelNumber == first_trial) %>%                  
  select(starts_with("aha"), starts_with("nm"), starts_with("e"), starts_with("f"), starts_with("mw"), r1b, r2b, r3b, -first_trial) %>% 
  drop_na()

# Confirmatory Factor Analysis

fa_results <- fa(items, nfactors = 6, rotate = "oblimin")
fa_results

# Cronbach's alpha

alpha(items[,1:3]) # aha! experience

alpha(items[,4:6]) # new moves

alpha(items[,7:9]) # heightened enjoyment

alpha(items[,10:12]) # focused immersion

alpha(items[,13:15]) # mind wandering

alpha(items[,16:18]) # resources
  
##### GENERAL PERFORMANCE #####

# Completion
completion <- data %>%
  group_by(levelNumber) %>%
  summarise(
    completed_count = sum(completedLevel),              
    percent_completed = mean(completedLevel) * 100,     
    n = n()                                             
  )

completion # Completion count, average, and sample size

# Early completion
early_completion <- data %>%
  group_by(levelNumber) %>%
    summarize(
      completed_early_count = sum(completedEarly),         
      percent_completedearly = mean(completedEarly)*100,   
      n = n()                                              
    )

early_completion # Early completion count, average, and sample size

# Completion duration
completion_duration <- data %>%
  filter(completedLevel == 1) %>% 
  mutate(
    durationBreak = ifelse(durationBreak == "null", "0", durationBreak),
    totalTime = as.numeric(durationToBeatGame) - as.numeric(durationBreak)
    ) %>%
  group_by(levelNumber) %>%
    summarize(duration_to_beat_puzzle = mean(totalTime, na.rm = TRUE))   
              
completion_duration # Average duration to complete 

# For the ease of interpretation, rather than referring to the levels using the internal numbers, we can now classify based on their actual difficulties.

data <- data %>%
  mutate(levelNumber = recode(levelNumber,
                              `5` = "hard",
                              `7` = "easy",
                              `8` = "medium")) %>%
  rename(level = levelNumber) %>%
  mutate(level = factor(level, levels = c("easy", "medium", "hard")))


difficulty <- data %>% 
  group_by(level) %>% 
    summarize(
      average_difficulty = mean(difficultyValue, na.rm = TRUE)     
    )

difficulty #Average perceived difficulty

# Perceived impasse
impasse <- data %>% 
  group_by(level) %>% 
  summarize(
    average_impasse = mean(stuckValue, na.rm = TRUE)     
  )

impasse #Average perceived difficulty

##### MANIPULATION CHECKS #####

# We now explore whether our manipulation is valid. Here, we compare perceptions between the HIS and non-HIS conditions.

manipulation_data <- data %>%
  filter(condition != 1) %>% 
  drop_na(f1, f2, f3, nm1, nm2, nm3, e1, e2, e3, mw1, mw2, mw3, r1b, r2b, r3b, r1, r2, r3, ra, pw) %>% 
  mutate(
    focused_immersion = rowMeans(select(., f1, f2, f3)),
    heightened_enjoyment = rowMeans(select(., e1, e2, e3)),
    mind_wandering = rowMeans(select(., mw1, mw2, mw3)),
    perceived_use_of_new_strategies = rowMeans(select(., nm1, nm2, nm3)),
    resources_before = rowMeans(select(., r1b, r2b, r3b)),
    resources_after = rowMeans(select(., r1, r2, r3)),
    resources_difference = resources_after - resources_before
  )

# Mixed effects models are used here to account for the repeated measures in our experiment (i.e., control for baseline differences among participants). 

fi_lm <- lmer(focused_immersion ~ condition + (1|prolificPID), data = manipulation_data)
summary(fi_lm) # focused immersion

he_lm <- lmer(heightened_enjoyment ~ condition + (1|prolificPID), data = manipulation_data)
summary(he_lm) # heightened enjoyment

mw_lm <- lmer(mind_wandering ~ condition + (1|prolificPID), data = manipulation_data)
summary(mw_lm) # mind-wandering

pw_lm <- lmer(pw ~ condition + (1|prolificPID), data = manipulation_data)
summary(pw_lm) # active work on the puzzle during break

rd_lm <- lmer(resources_difference ~ condition + (1|prolificPID), data = manipulation_data)
summary(rd_lm) # change in resources

r_lm <- lmer(ra ~ condition + (1|prolificPID), data = manipulation_data)
summary(r_lm) # perceived recovery after break

nm_lm <- lmer(perceived_use_of_new_strategies ~ condition + (1|prolificPID), data = manipulation_data)
summary(nm_lm) # perceived use of new strategies/moves after a break

##### EXPLORATORY ANALYSES ###### 

# Is mind wandering related to completion likelihood?
lm1 <- glmer(completedLevel ~ mind_wandering + (1|prolificPID), family="binomial", data = manipulation_data)
summary(lm1)

# Is the perceived use of new strategies related to completion likelihood?
lm2 <- glmer(completedLevel ~ perceived_use_of_new_strategies + (1|prolificPID), family="binomial", data = manipulation_data)
summary(lm2)

##### INSIGHT EXPERIENCE ######

# We can see if Sokoban is a valid non-routine problem by exploring whether people perceived an aha! moment when they completed a level. Furthermore, those who solved the puzzle after a longer time are more likely to have experienced this than those that quickly completed the puzzles.

insight_data  <- data %>% 
  drop_na(aha1, aha2, aha3) %>% 
  mutate(
    aha = rowMeans(select(., aha1, aha2, aha3))
  )

i_lm <- lmer(aha ~ completedLevel + completedEarly + (1|prolificPID), data = insight_data)
summary(i_lm) 

##### MAIN ANALYSES ######

# First, we check if any of the control variables are relevant. Not enough participants identified as neither male or female at birth and as ambidextrous, so these participants are excluded. However, they are used in the main analyses if we exclude these variables in the models. 

main_data <- data %>%
  left_join(
    survey %>%
      select(prolificPID, age, handedness, sex, videoGameHours, smartphoneHours, sokobanFamiliarity, digitalDeviceHours, shortFormVideos, trialOrder, conditionOrder),
    by = "prolificPID"
  ) %>%
  filter(
    sex %in% c(0, 1), # 1 participant put other
    handedness %in% c(0,1), # 5 participants put ambidextrous
    prolificPID != "6466190f0491049a32d5b0fc", # this participant put an invalid age (-57)
    completedEarly != 1 # include only those who encountered manipulations
    ) %>%
  mutate(
    sex = factor(sex, levels = c(0, 1), labels = c("Female", "Male")),
    handedness = factor(handedness, levels = c(0, 1), labels = c("Left", "Right")),
    trialOrder = factor(trialOrder),
    conditionOrder = factor(conditionOrder)
    )

# Base model, completion likelihood   

model_base <- glmer(completedLevel ~  level * condition + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

# Including 1 Control

model_age <- glmer(completedLevel ~  level * condition + age + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_sex <- glmer(completedLevel ~  level * condition + sex + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_handedness <- glmer(completedLevel ~  level * condition + handedness + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_videoGames <- glmer(completedLevel ~  level * condition + videoGameHours + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_smartphones <- glmer(completedLevel ~  level * condition + smartphoneHours + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_sokoban <- glmer(completedLevel ~  level * condition + sokobanFamiliarity + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_digitalDevice <- glmer(completedLevel ~  level * condition + digitalDeviceHours + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_shortFormVideos <- glmer(completedLevel ~  level * condition + shortFormVideos + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_trialOrder <- glmer(completedLevel ~  level * condition + trialOrder + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

model_conditionOrder <- glmer(completedLevel ~  level * condition + conditionOrder + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

models <- list(
  base = model_base,
  age = model_age,
  sex = model_sex,
  handedness = model_handedness,
  videoGames = model_videoGames,
  smartphones = model_smartphones,
  sokoban = model_sokoban,
  digitalDevice = model_digitalDevice,
  shortFormVideos = model_shortFormVideos,
  trialOrder = model_trialOrder,
  conditionOrder = model_conditionOrder
)

# Comparing Models
aic_results <- sapply(models, AIC)
aic_results <- sort(aic_results)
aic_results

bic_results <- sapply(models, BIC)
bic_results <- sort(bic_results)
bic_results

# Sex and daily video game playtime improve the model quality, however including both of them does not significantly improve model fit compared to the model with sex alone

model_sex_videoGames <- glmer(completedLevel ~  level * condition + sex + videoGameHours + (1|prolificPID), family="binomial", control = glmerControl(optimizer = "bobyqa"), data = main_data)

summary(model_sex_videoGames)

anova(model_sex_videoGames, model_sex)

predictions <- ggpredict(model_sex, terms = c("level", "condition"))

plot(predictions) +
  labs(title = "",
       x = "Level Difficulty", y = "Predicted Probability of Completing Level") +
  coord_cartesian(ylim = c(0, .5)) 

# Duration after break 

completed_data <- main_data %>% 
  filter(completedLevel == 1) %>% 
  mutate(
    durationAfterBreak = as.numeric(durationAfterBreak)
  )

# Comparing models
lm_base <- lmer(durationAfterBreak ~  level * condition + (1|prolificPID), data = completed_data)

lm_age <- lmer(durationAfterBreak ~  level * condition + age + (1|prolificPID), data = completed_data)

lm_sex <- lmer(durationAfterBreak ~  level * condition + sex + (1|prolificPID), data = completed_data)

lm_handedness <- lmer(durationAfterBreak ~  level * condition + handedness + (1|prolificPID), data = completed_data)

lm_videoGames <- lmer(durationAfterBreak ~  level * condition + videoGameHours + (1|prolificPID), data = completed_data)

lm_smartphones <- lmer(durationAfterBreak ~  level * condition + smartphoneHours + (1|prolificPID), data = completed_data)

lm_sokoban <- lmer(durationAfterBreak ~  level * condition + sokobanFamiliarity + (1|prolificPID), data = completed_data)

lm_digitalDevice <- lmer(durationAfterBreak ~  level * condition + digitalDeviceHours + (1|prolificPID), data = completed_data)

lm_shortFormVideos <- lmer(durationAfterBreak ~  level * condition + shortFormVideos + (1|prolificPID), data = completed_data)

lm_trialOrder <- lmer(durationAfterBreak ~  level * condition + trialOrder + (1|prolificPID), data = completed_data)

lm_conditionOrder <- lmer(durationAfterBreak ~  level * condition + conditionOrder + (1|prolificPID), data = completed_data)

models2 <- list(
  base = lm_base,
  age = lm_age,
  sex = lm_sex,
  handedness = lm_handedness,
  videoGames = lm_videoGames,
  smartphones = lm_smartphones,
  sokoban = lm_sokoban,
  digitalDevice = lm_digitalDevice,
  shortFormVideos = lm_shortFormVideos,
  trialOrder = lm_trialOrder,
  conditionOrder = lm_conditionOrder
)

# Comparing Models
aic_results2 <- sapply(models2, AIC)
aic_results2 <- sort(aic_results2)
aic_results2

bic_results2 <- sapply(models2, BIC)
bic_results2 <- sort(bic_results2)
bic_results2


ggplot(completed_data, aes(x = level, y = durationAfterBreak, color = condition, group = condition)) +
  stat_summary(fun = mean, geom = "point", position = position_dodge(width = 0.2)) +
  stat_summary(fun = mean, geom = "line", aes(group = condition), position = position_dodge(width = 0.2)) +
  stat_summary(fun.data = mean_se, geom = "errorbar", width = 0.2, position = position_dodge(width = 0.2)) +
  labs(x = "Level", y = "Duration After Break", color = "Condition") +
  theme_minimal()
