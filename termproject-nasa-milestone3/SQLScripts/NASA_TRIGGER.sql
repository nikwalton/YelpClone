-- Defines a trigger to update counts when a tip is inserted
CREATE OR REPLACE FUNCTION updateTipCounts()
RETURNS trigger AS '
   BEGIN
      UPDATE Users
      SET tip_count = tip_count + 1
      WHERE Users.user_id = NEW.user_id;
      UPDATE Business
      SET num_tips = num_tips + 1
      WHERE Business.business_id = NEW.business_id;
      RETURN NEW;
   END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS TipInsert
  ON public.Tip;
CREATE TRIGGER TipInsert
AFTER INSERT ON Tip
FOR EACH ROW
EXECUTE PROCEDURE updateTipCounts();

-- Test (Run each SELECT statement separately because you must press 'q' after each)
INSERT INTO Tip VALUES ('2022-03-23 12:00:00', '---1lKK3aKOuomHnwAkAow', '--KQsXc-clkO7oHRqGzSzg', 'Test Tip');
SELECT * FROM Tip WHERE text='Test Tip';
SELECT * FROM Users WHERE user_id='---1lKK3aKOuomHnwAkAow';
SELECT * FROM Business WHERE business_id='--KQsXc-clkO7oHRqGzSzg';
-- Cleanup
DELETE FROM Tip WHERE text='Test Tip';
UPDATE Users SET tip_count = tip_count-1 WHERE user_id='---1lKK3aKOuomHnwAkAow';
UPDATE Business SET num_tips = num_tips-1 WHERE business_id='--KQsXc-clkO7oHRqGzSzg';

-- Defines a trigger to update number of checkins when a check-in is inserted
CREATE OR REPLACE FUNCTION updateNumCheckins()
RETURNS trigger AS '
   BEGIN
      UPDATE Business
      SET num_checkins = num_checkins + 1
      WHERE Business.business_id = NEW.business_id;
      RETURN NEW;
   END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS CheckinInsert
  ON public.checkin;
CREATE TRIGGER CheckinInsert
AFTER INSERT ON Checkins
FOR EACH ROW
EXECUTE PROCEDURE updateNumCheckins();

-- Defines a trigger to update the "totalLikes" attribute value for the user who wrote that tip
CREATE OR REPLACE FUNCTION updateTotalLikes()
RETURNS trigger AS '
   BEGIN
         UPDATE Users
         SET total_likes = total_likes + 1
         WHERE Users.user_id = NEW.user_id;
      RETURN NEW;
   END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS LikesUpdate 
   ON public.Tip;
CREATE TRIGGER LikesUpdate
AFTER UPDATE OF likes ON Tip
FOR EACH ROW
EXECUTE PROCEDURE updateTotalLikes();

-- Test
UPDATE Tip SET likes = 41 WHERE user_id = 'FuTJWFYm4UKqewaosss1KA' AND likes = 40;
SELECT * FROM Tip WHERE user_id = 'FuTJWFYm4UKqewaosss1KA';    -- likes should equal 41
SELECT * FROM Users WHERE user_id = 'FuTJWFYm4UKqewaosss1KA';  -- total_likes should equal 1
-- Cleanup
UPDATE Tip SET likes = 40 WHERE user_id = 'FuTJWFYm4UKqewaosss1KA' AND likes = 41;
