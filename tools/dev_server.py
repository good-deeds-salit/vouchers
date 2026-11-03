#!/usr/bin/env python3
"""Local development server with no-cache headers (development only).

Serves the project folder over HTTP and tells the browser never to reuse cached files, so a normal
refresh always shows the latest HTML, CSS and JavaScript. It uses only the Python standard library.

Usage:
    python tools/dev_server.py            # http://localhost:8000
    python tools/dev_server.py --port 8001

It does not affect production: GitHub Pages serves the site itself and never runs this file.
If the port is already taken (for example by an older server), it says so and exits; it never
stops or replaces another server.
"""
import argparse
import os
import socket
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class DevServer(ThreadingHTTPServer):
    # On Windows, SO_REUSEADDR lets a second server bind a port that is already in use, which would
    # silently interfere with an existing server. Keep it off there so a busy port is reported instead.
    allow_reuse_address = os.name != "nt"


def port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.settimeout(0.5)
        return probe.connect_ex(("127.0.0.1", port)) == 0


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description="No-cache local dev server for this project.")
    parser.add_argument("--port", type=int, default=8000, help="port to listen on (default: 8000)")
    args = parser.parse_args()

    handler = partial(NoCacheHandler, directory=str(PROJECT_ROOT))
    server = None
    try:
        if not port_in_use(args.port):
            server = DevServer(("127.0.0.1", args.port), handler)
    except OSError:
        server = None
    if server is None:
        print(
            f"Port {args.port} is already in use, possibly by an older server that may serve cached "
            f"or outdated files.\nStop that server yourself, or start this one on another port:\n"
            f"    python tools/dev_server.py --port {args.port + 1}",
            file=sys.stderr,
        )
        return 1

    print(f"Serving {PROJECT_ROOT} with no-cache headers at http://localhost:{args.port}  (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
