package com.buspass.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UploadServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String file = request.getParameter("file");
        response.setContentType("text/plain");
        response.getWriter().println("Simulated Document Stream for path: " + file);
        response.getWriter().println("File upload generation logic disabled for simplicity.");
    }
}
