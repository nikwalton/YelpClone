
-- Calculate the num_tip for businesses
-- doing this instead of just a striaght update statement to save procesisng time
WITH tip_count AS (
   SELECT 
      business_id,
      COUNT(tip_date) as tip_num
   FROM Tip
   GROUP BY business_id      
)
UPDATE Business
SET num_tips = tc.tip_num
FROM tip_count tc
WHERE tc.business_id = Business.business_id;

-- Calculate and update tip_count for users
WITH user_tips AS (
   SELECT
      user_id,
      COUNT(tip_date) as tip_count
   FROM Tip
   GROUP BY user_id
)
UPDATE Users
SET tip_count = user_tips.tip_count
FROM user_tips
WHERE Users.user_id = user_tips.user_id;

-- Calculate and update total_likes for users
WITH user_total_likes AS (
   SELECT 
      user_id,
      SUM(likes) as tip_likes
   FROM Tip
   GROUP BY user_id
)
UPDATE Users
SET total_likes = user_total_likes.tip_likes
FROM user_total_likes 
WHERE Users.user_id = user_total_likes.user_id;

-- Calculate and update num_checkins for business
WITH business_checkins AS (
   SELECT 
      business_id,
      COUNT(checkin_time) as checkin_nums
   FROM CheckIns
   GROUP BY business_id      
)
UPDATE Business
SET num_checkins = bc.checkin_nums
FROM business_checkins bc
WHERE bc.business_id = Business.business_id;