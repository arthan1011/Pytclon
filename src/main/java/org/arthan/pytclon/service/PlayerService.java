package org.arthan.pytclon.service;

import com.google.common.collect.Lists;
import org.arthan.pytclon.domain.control.PlayerDao;
import org.arthan.pytclon.domain.control.PlayerImageDao;
import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.Player;
import org.arthan.pytclon.domain.entity.PlayerImage;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Arthur Shamsiev on 21.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Stateless
public class PlayerService implements Serializable {

    private PlayerDao playerDao;
    private UserDao userDao;
    private PlayerImageDao playerImageDao;

    @Inject
    public PlayerService(
            PlayerDao playerDao,
            UserDao userDao,
            PlayerImageDao playerImageDao
    ) {
        this.playerDao = playerDao;
        this.userDao = userDao;
        this.playerImageDao = playerImageDao;
    }

    public PlayerService() {

    }

    public List<Player> findAllByUserName(String userName) {
        Integer userId = userDao.findByLogin(userName).getId();
        return playerDao.findAllByUserId(userId);
    }

    public void addPlayerImages(List<PlayerImage> playerImages) {
        for (PlayerImage image : playerImages) {
            playerImageDao.save(image);
        }
    }

    public byte[] getImageContentById(String imageId) {
        PlayerImage playerImage = playerImageDao.byId(Integer.valueOf(imageId));
        return playerImage.getContent();
    }

    public List<Integer> getAllImagesIds() {
        List<PlayerImage> allImages = playerImageDao.findAll();
        List<Integer> ids = Lists.newArrayList();
        ids.addAll(allImages.stream()
                .map(PlayerImage::getId)
                .collect(Collectors.toList()));
        return ids;
    }
}
