# USB Flashing Guide for BeagleBones
### Written for CMPT433 in Summer 2018 at SFU
##### By: Oscar
---

#### Formatting: 
Similar to the official guides, this guide will use the following convention for where you should run commands:

* Commands prefixed by `$` are for the host. Example: `$ echo "This is on the host!"`
* Commands prefixed by `#` are for the target. Example: `# echo "This is on the target!"`
* Commands prefixed by `=>` are for use in uboot. Example: `=> echo "This is in uboot!"`


# 1. Downloading the flashing system

#### Intro
This process is powered at its core by a project on github. You can check out the repo [here](https://github.com/Jerald/beaglebone_usb_flash).

This project is a fork of a Google Summer of Code project from 2013. The original repo is [here](https://github.com/ungureanuvladvictor/BBBlfs). Since it was made, there have been some changes in aspects of the BeagleBone setup so a number of changes were requires to ensure it worked.

#### Steps

1. First you need to clone the project repo. Navigate to wherever you'd like it cloned to then run the following commands.
    ```bash
    $ mkdir beaglebone_usb_flasher
    $ git clone https://github.com/Jerald/beaglebone_usb_flash.git ./beaglebone_usb_flasher
    ```
    This will make a new folder for the repo then clone it into there from github. 
    
2. Change into the folder you've made for the project with the following:
    ```bash
    $ cd beaglebone_usb_flasher
    ```
    Now you'll need to compile an executable called `usb_flasher` which is used to boot your BeagleBone and expose it to your host. This requires two dependencies, `automake` and `libusb`. If you're on a distro other than ubuntu, use your favourite package manager to get them. Otherwise, run the following commands:
    ```bash
    $ sudo apt install automake libusb
    ```
    Now that you have the build dependencies, you need to actually make the executable. Run the following commands to do that:
    ```bash
    $ ./autogen.sh
    $ ./configure
    $ make
    ```