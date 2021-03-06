export CROSS_TOOL = arm-linux-gnueabihf-
export CC := $(CROSS_TOOL)gcc
export CXX := $(CROSS_TOOL)g++

export warningFlags = -Wall #-Werror
export debugFlags = -g -Og# -DSIMULATION
export libFlags = -pthread -Wl,--rpath-link=/usr/arm-linux-gnueabihf/lib
export miscFlags := -std=c99 -D_POSIX_C_SOURCE=200809L -I/$(CURDIR)/buildreqs
export flags := $(miscFlags) $(libFlags) $(debugFlags) $(warningFlags)

# Manually compiled in during the build stage
export libpq := $(CURDIR)/buildreqs/libpq.so

# Symlink the below folder to be where you want the actual output to be
export outPath := $(CURDIR)/outFolder
export controllerOutName = controller.out
export webserverOutFolder = webserver

all:
	echo "No 'all' target!"

controller:
	cd $(CURDIR)/controller_src && $(MAKE)

server:
	cd $(CURDIR)/webserver_src && $(MAKE)
	
sequel:
	cp $(CURDIR)/setup.sql $(outPath)/

clean:
	cd $(CURDIR)/controller_src && $(MAKE) clean
	cd $(CURDIR)/webserver_src && $(MAKE) clean
