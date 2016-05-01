package integration.gui.pages;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by arthan on 29.04.2016. Project pytclon
 */

public class WebObject {

    private Map<String, String> map = new HashMap<>();

    public String prop(String propertyName) {
        return map.get(propertyName);
    }

    public void prop(String propertyName, String property) {
        map.put(propertyName, property);
    }
}
