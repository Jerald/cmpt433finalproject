#include <pthread.h>
#include "machineInterface.h"

// Makes a thread and returns the pthread_t for it
// startingFunc is a pointer to a function pointer which is where the thread will start
// arg is a string pointer (char**) to the arguments in classic argv style (function name first)
pthread_t makeThread(void* startingFunc, char** arg)
{
    pthread_t thread;
    pthread_create(&thread, NULL, startingFunc, arg);
    return thread;
}

// Joins the thread specified by thread
// Returns 0 on success or the error code
int joinThread(pthread_t thread)
{
    return pthread_join(thread, NULL);
}

void ThreadManager_init()
{
	//start threads for modules here.
	MachineInterface_init();
}
