# Makefile for building embedded application.
# by Brian Fraser

# Edit this file to compile extra C files into their own programs.
TARGET= pop
SOURCES= main.c threadManager.c


PUBDIR = $(HOME)/cmpt433/public/myApps
OUTDIR = $(PUBDIR)
CROSS_TOOL = arm-linux-gnueabihf-
CC_CPP = $(CROSS_TOOL)g++
CC_C = $(CROSS_TOOL)gcc

CFLAGS = -Wall -g -std=c99 -D _POSIX_C_SOURCE=200809L -Werror

# -pg for supporting gprof profiling.
#CFLAGS += -pg



all: app node

app:
	$(CC_C) $(CFLAGS) $(SOURCES) -o $(OUTDIR)/$(TARGET) -lpthread
	
node:
	mkdir -p $(PUBDIR)/pop-server-copy/
	cp -R web/* $(PUBDIR)/pop-server-copy/
	

clean:
	rm -f $(OUTDIR)/$(TARGET)
	
	