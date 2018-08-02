# USB Flashing Guide for BeagleBones
### Written for CMPT433 in Summer 2018 at SFU
##### By: Oscar
---

#### Formatting: 
Similar to the official guides, this guide will use the following convention for where you should run commands:

* Commands prefixed by `$` are for the host. Example: `$ echo "This is on the host!"`
* Commands prefixed by `#` are for the target. Example: `# echo "This is on the target!"`
* Commands prefixed by `=>` are for use in uboot. Example: `=> echo "This is in uboot!"`


# 1. Preparing the flashing system

#### Intro
This process is powered at its core by a project on github. You can check out the repo [here](https://github.com/Jerald/beaglebone_usb_flash).

This project is a fork of a Google Summer of Code project from 2013. The original repo is [here](https://github.com/ungureanuvladvictor/BBBlfs). Since it was made, there have been some changes in aspects of the BeagleBone setup so a number of changes were requires to ensure it worked.

#### Steps

1. First you need to clone the project repo. Navigate to wherever you'd like it cloned to then run the following commands.
    ```sh
    $ mkdir beaglebone_usb_flasher
    $ git clone https://github.com/Jerald/beaglebone_usb_flash.git ./beaglebone_usb_flasher
    ```
    This will make a new folder for the repo then clone it into there from github. 
    
2. Change into the folder you've made for the project with the following:
    ```sh
    $ cd beaglebone_usb_flasher
    ```
    Now you need to compile an executable called `usb_flasher` which is used to boot your BeagleBone and expose it to your host. This requires two dependencies, `automake` and `libusb`. If you're on a distro other than ubuntu, use your favourite package manager to get them. Otherwise, if you are on ubuntu run the following command:
    ```sh
    $ sudo apt install automake libusb
    ```
    Now that you have the build dependencies, you need to actually make the executable. Run the following commands to do that:
    ```sh
    $ ./autogen.sh
    $ ./configure
    $ make
    ```
    Now the flashing system is all ready to begin! Next step: actually having something to flash.

# 2. Preparing the BeagleBone

### Intro 
Now that everything is setup within the repo, you need to actually download an image to flash onto the BeagleBone. If you'd like, you can view the latest images [here](http://beagleboard.org/latest-images) on the BeagleBone website and pick your own. But there's steps to download it easily if you don't care to peruse.

### Steps

1. Firstly, navigate to the `bin/` directory within the repo. This is where the executable was compiled to and where the code we'll be running is. Assuming you're within the repo to start with, change it with:
    ```sh
    $ cd ./bin
    ```

2. For ease, you can use the below commands which download the latest image as of the release of this guide. I may update this link every once in awhile with the newest image.

    Download the image with:
    ```sh
    $ wget -O ./image.img.xz http://debian.beagleboard.org/images/bone-debian-9.4-iot-armhf-2018-06-17-4gb.img.xz
    ```
    If you chose a different image to use off of the website, you can change the url in the command or just download it normally and change the path you use with the flashing script.

3. At this point we have the flashing system ready and an image to flash downloaded. Now all that's left is to actually do it!

    For your BeagleBone to be flashed it needs to be put into USB boot mode. This is achieved by holding whats called the S2 button while plugging in the board. That's the small button on the **opposite** side of the board as the ethernet port. It's next to the weird beige connecters if you have a BeagleBone Green.

    **Be sure you put the board into USB boot mode.** You'll know you did it right if the single power light next to the ethernet is on, but the row of 4 isn't flashing at all.

4. Now that you've put the BeagleBone into USB boot mode, we're ready to use the flashing system. Staying within the `bin/` folder, you need to run the following command:
    ```sh
    $ sudo ./flash_script.sh ./image.img.xz
    ```
    If you downloaded your image to somewhere else, change the path to it. The name can be whatever it wants, but the extension should be `.img.xz`.
    
    The script will guide you through the remaining steps. If you have any issues, check the troubleshooting section.


