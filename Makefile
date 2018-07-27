export CROSS_TOOL = arm-linux-gnueabihf-
export CC := $(CROSS_TOOL)gcc
export CXX := $(CROSS_TOOL)g++

export warningFlags = -Wall -Werror
export debugFlags = -g -Og
export libFlags = -pthread
export miscFlags = -std=c99 -D_POSIX_C_SOURCE=200809L -I/usr/include/postgresql -lpq
export flags := $(miscFlags) $(libFlags) $(debugFlags) $(warningFlags)

export controllerOutName = controller.out

# Symlink the below folder to be where you want the actual output to be
export outPath := $(CURDIR)/outFolder

all:
	echo "No 'all' target!"

controller:
	cd $(CURDIR)/controller_src && $(MAKE)

server:
	cd $(CURDIR)/webserver_src && $(MAKE)

clean:
	cd $(CURDIR)/controller_src && $(MAKE) clean
	cd $(CURDIR)/webserver_src && $(MAKE) clean
	# rm -f $(outPath)sorter.out $(outPath)/noworky.out
