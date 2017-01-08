<img align="right" height="32" src="https://radicallyopensecurity.com/images/ros-logo.gif">

# NAD (Necessity Anti-DDoS) project

## Overview

NAD is a DDoS (Distributed Denial of Service) detection and mitigation appliance. Our codebase is mainly NodeJS, with modules that can be written in other languages as well. 

## Usage

1. Make sure you are running an MySQL database primed with contents from: /db/db.mysql

2. Run the NAD node.
```
git clone https://github.com/radicallyopensecurity/anti-ddos
cd nad
./nad
```
3. Open http://localhost:1111 to access the REST API. We use only GET functions for ease of use.

4. You can also access all REST functions from the command-line in another terminal, once NAD is running.

### Command examples:
```
./nad /sensor/MX480/read
```

```
./nad /proc/1480417287318968
```

## More information

NAD works with a bus in the form of a REST API, and database module. All actions are handled through a processor and scheduler. 
Every command gived to a NAD module will return a JSON object containing the process number of the action that has been queued into the scheduler. To see the data in that process, you can read it out using the /proc/PROCESS_NUMBER path.
This makes asynchronous requests possible, and by reading the process progress variable, a front-end can be updated as to the real status of a process.

For additional information check the Wiki at: https://github.com/radicallyopensecurity/anti-ddos/wiki

## Troubleshooting

 <i>What is this supposed to do?</i>
 The current prototype scans an MX480 router to get network traffic data to calculate thresholds.
 
 <i>Can I use my own version of NodeJS?</i>
 We have included a 32-bit and 64-bit version of NodeJS to make things work out of the box, but you can certainly use your own. Please amend the symbolic link if necessary in your case.

 <i>What if I get the error "Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'ddos-monitor'@'localhost'"?</i>
 Make sure your are running an MySQL database primed with contents, and that you configure access to it in <b>hybridd.conf</b>.
 
## Authors

Joachim de Koning <contact@metasync.net>
Amadeus de Koning <amd.dekoning@metasync.net>

## License

This work is licensed under the GNU GPLv3 license. (See the LICENSE file in the root of this repository.)

Copyright (c) 2016 ROS / Metasync

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
