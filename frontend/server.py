#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

PORT = 3015

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/' or self.path.startswith('/static') or not os.path.exists(self.path[1:]):
            self.path = '/complete-app.html'
        return super().do_GET()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"CryptoFund Nexus server running on http://localhost:{PORT}")
    print(f"Access the application at: http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()