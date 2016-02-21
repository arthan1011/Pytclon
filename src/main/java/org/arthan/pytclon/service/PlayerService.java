package org.arthan.pytclon.service;

import javax.ejb.Stateless;
import java.io.PrintStream;

/**
 * Created by Arthur Shamsiev on 21.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Stateless
public class PlayerService {

    public void greet(PrintStream to, String name) {
        to.print(createGreeting(name));
    }

    public String createGreeting(String name) {
        return "Hello, " + name + ".";
    }
}
