package org.arthan.pytclon.domain.entity;

import org.junit.Assert;
import org.junit.Test;

/**
 * Created by arthan on 19.06.2016. Project pytclon
 */
public class PlayerTest {

    @Test
    public void shouldMergePlayer() throws Exception {
        final int TEST_IMAGE_ID = 42;
        final String TEST_NAME = "test_name";
        final int NEW_IMAGE_ID = 43;

        Player player = new Player(TEST_NAME, TEST_IMAGE_ID);

        Player newPlayer = new Player();
        newPlayer.setPlayerImageId(NEW_IMAGE_ID);

        player.merge(newPlayer);

        Assert.assertEquals(
                "Player should have new player image id after merge",
                NEW_IMAGE_ID,
                player.getPlayerImageId().intValue()
        );
    }
}