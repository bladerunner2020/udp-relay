# UDP Relay

## Introduction

**UDP Relay** receives UDP packets and forward it to specified IP-address or broadcast. It was made to answer the need to send broadcast UDP-packets (such as wake-on-lan) from a docker container. I found it quite complicated to setup forwarding udp broadcast from docker to external world and after many attempts wrote this tool.

## Usage

There are 2 options.

**Options 1 (NOT SUPPORTED YET)**

Setup 2 intstances oof **UDP Relay**: one inside docker container, second - outside. 

**Option s**

Setup **UDP Relay** outside docker container and set your application sent direct UDP packets to **UDP Relay**.

## NOTES

- This is **alpha** version - the most of the featres are not yet implemented :-)
- It supports only **option 2** usage
- Only **port 9** and only broadcast to **255.255.255.255**
