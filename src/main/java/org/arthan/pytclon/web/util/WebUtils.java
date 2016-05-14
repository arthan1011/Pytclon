package org.arthan.pytclon.web.util;

import java.text.MessageFormat;
import java.util.List;

/**
 * Created by arthan on 14.05.2016. Project pytclon
 */
public class WebUtils {
    public static String createRange(List<?> list) {
        return MessageFormat.format("items 0-{0}/{1}", list.size() - 1, list.size());
    }
}
