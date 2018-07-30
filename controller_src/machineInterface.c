/*
 * machineInterface.c
 *
 *
 */


#include <fcntl.h>
#include <linux/i2c.h>
#include <linux/i2c-dev.h>
#include <pthread.h>
#include <sys/ioctl.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>

#include "threadManager.h"
#include "machineInterface.h"
#include "databaseManager.h"

//need to decide which bus we'll be using
#define I2C_BUS1 "/dev/i2c-2"
#define SELECTION_BUTTONS_REG 0x13 //fill in when known
#define READY_BTTONS_REG 0x12 //fill in when known
#define ALL_PINS_INPUT 0xff
#define I2C_DEVICE_ADDRESS 0x20 //fill in when known
#define NUM_BITS 8
#define NUM_COLUMNS 8
#define RTV_FILE_PATH "/sys/bus/iio/devices/iio:device0/in_voltage1_raw"
#define RTV_READ_SZ 128

int usleep(useconds_t usec);

static pthread_t machineInterfaceThreadID;
static int i2cFileDesc;
static FILE* rtvFileDesc;

//static void* mainLoop(void *args);
//static int initI2cBus(char* bus, int address);
//static unsigned char readI2cReg(int i2CFileDesc, unsigned char regAddr);

static int MachineInterface_initI2cBus(char* bus, int address);
static int MachineInterface_initRTV();
static int MachineInterface_readRTV();
static unsigned char MachineInterface_readI2cReg(int i2CFileDesc, unsigned char regAddr);
static void* MachineInterface_thread(void *args);

static int checkButtonPresses = 1;

static int MachineInterface_initRTV(){
    rtvFileDesc = fopen(RTV_FILE_PATH, "r");
    //rtvFileDesc = open("/root/a", O_RDONLY);
    if(rtvFileDesc == NULL){
        printf("fopen() Could not open file /root/a \"%s\"\n, error: %d\n", RTV_FILE_PATH, errno);
        exit(EXIT_FAILURE);
        return 1;
    }
    return 0;
}




void MachineInterface_init(void)
{
#ifndef SIMULATION
	MachineInterface_initI2cBus(I2C_BUS1, I2C_DEVICE_ADDRESS);
    MachineInterface_initRTV();
#endif
    machineInterfaceThreadID = makeThread(&MachineInterface_thread, NULL);
}

void MachineInterface_stop(void)
{
    checkButtonPresses = 0;
    MachineInterface_waitstop();
}

void MachineInterface_waitstop(){
	joinThread(machineInterfaceThreadID);
	close(i2cFileDesc);
}

static void* MachineInterface_thread(void *args)
{
	unsigned char regVal;
	int buttonPushed = -1;
    int lastButtonPushed = -1;
    unsigned char buttonsReady;

	while (checkButtonPresses) {
        usleep(10);

        //First, check which columns are ready to vend
		//regVal = MachineInterface_readI2cReg(i2cFileDesc, READY_BTTONS_REG);
        //TODO: May need to remap, could be difficult to correlate....
        buttonsReady = MachineInterface_readRTV();

		regVal = MachineInterface_readI2cReg(i2cFileDesc, SELECTION_BUTTONS_REG);
        //Look for 0s in the bits
        buttonPushed = -1;
		for (int i = 0; i < NUM_BITS; i++) {
			if (buttonsReady >= 200 && ((1 << i) & regVal) == 0) {
                buttonPushed = i;
                if(buttonPushed != lastButtonPushed){
                    printf("Button pressed: %d\n", buttonPushed);
                    //call Database Module and update
                    dbManager_insertPurchase(buttonPushed);
                    sleep(1);
                }
			}
		}
        lastButtonPushed = buttonPushed;

        //Second, though the RTV columns for a button press
	}
    return NULL;
}




static int MachineInterface_initI2cBus(char* bus, int address)
{
	i2cFileDesc = open(bus, O_RDWR);
	if (i2cFileDesc < 0) {
		printf("Error: could not create i2c file descriptor");
		perror("Error is:");
		exit(1);
	}

	int result = ioctl(i2cFileDesc, I2C_SLAVE, address);
	if (result < 0) {
		perror("I2C: Unable to set I2C device to slave address");
		exit(1);
	}

	return i2cFileDesc;
}

static unsigned char MachineInterface_readI2cReg(int i2CFileDesc, unsigned char regAddr)
{
#ifndef SIMULATION
	int res = write(i2cFileDesc, &regAddr, sizeof(regAddr));
	if (res != sizeof(regAddr)) {
		perror("I2C: Unable to write to i2c register.");
		exit(1);
	}

	char value = 0;
	res = read(i2cFileDesc, &value, sizeof(value));
	if (res != sizeof(value)) {
		perror("I2C: unable to read from i2c register");
		exit(1);
	}

	return value;
#else
    unsigned char retVal = 0xff;
    int i;
    for(i = 0; i < NUM_BITS; i++){
        if(rand() % 30 == 0){
            retVal ^= (1 << i);
        }
    }
//    printf("Returning %x from i2cread\n", retVal);
    return retVal;
#endif
}

static int MachineInterface_readRTV(){
    char readBuf[RTV_READ_SZ] = {0};
    rewind(rtvFileDesc);
    int sz_read = fread(readBuf, sizeof(char), RTV_READ_SZ-1, rtvFileDesc);
    //int sz_read = read(rtvFileDesc, readBuf, RTV_READ_SZ-1);
    int readval = atoi(readBuf);
//    printf("ReadVal: %d from %s bytes: %d\n", readval, readBuf, sz_read);
    return readval;
}



