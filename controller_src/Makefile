src := $(wildcard *.c)
objs := $(patsubst %.c,%.o,$(src))

all: controller

controller: $(objs)
	cd $(CURDIR)/build/ && $(MAKE)

%.o : %.c
	$(CC) $(flags) -c $< -o $(CURDIR)/build/$@

clean:
	cd $(CURDIR)/build/ && $(MAKE) clean