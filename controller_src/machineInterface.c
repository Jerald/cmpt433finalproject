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
#include "machineInterface.h"
#include "databaseManager.h"

//need to decide which bus we'll be using
#define I2CDRV_LINUX_BUS0 "/dev/i2c-0"
#define I2CDRV_LINUX_BUS1 "/dev/i2c-1"
#define I2CDRV_LINUX_BUS2 "/dev/i2c-2"
#define BUTTONS_REG 0x00 //fill in when known
#define I2C_DEVICE_ADDRESS 0x00 //fill in when known
#define NUM_BITS 8


static pthread_t MachIfaceThId;
int i2cFileDesc;

static void* MachineInterface_thread(void *args);
static int MachineInterface_initI2cBus(char* bus, int address);
static unsigned char MachineInterface_readI2cReg(int i2CFileDesc, unsigned char regAddr);
static void* MachineInterface_thread(void *args);

void MachineInterface_init(void)
{
	MachineInterface_initI2cBus(I2CDRV_LINUX_BUS1, I2C_DEVICE_ADDRESS);
	pthread_create(&MachIfaceThId, NULL, &MachineInterface_thread, NULL);
}

void MachineInterface_stop(void)
{
	close(i2cFileDesc);
	pthread_join(MachIfaceThId, NULL);
}

static void* MachineInterface_thread(void *args)
{
	unsigned char regVal;
	int buttonPushed;
	while(1){

		regVal = MachineInterface_readI2cReg(i2cFileDesc, BUTTONS_REG);
		for (int i=0; i<NUM_BITS; i++){
			if (((1 << i) & regVal) == 0){
				buttonPushed = i;
				//call Database Module and update
			}
		}

	}
}
static int MachineInterface_initI2cBus(char* bus, int address)
{
	int i2cFileDesc = open(bus, O_RDWR);
	if(i2cFileDesc < 0){
		printf("Error: could not create i2c file descriptor");
		perror("Error is:");
		exit(1);
	}
	int result = ioctl(i2cFileDesc, I2C_SLAVE, address);
	if(result < 0){
		perror("I2C: Unable to set I2C device to slave address");
		exit(1);
	}
	return i2cFileDesc;

}

static unsigned char MachineInterface_readI2cReg(int i2CFileDesc, unsigned char regAddr)
{
	int res = write(i2cFileDesc, &regAddr, sizeof(regAddr));
	if(res != sizeof(regAddr)) {
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
}






