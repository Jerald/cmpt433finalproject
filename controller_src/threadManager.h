#ifndef THREADMANAGER_H_
#define THREADMANAGER_H_

#include <pthread.h>

pthread_t makeThread(void* startingFunc, char** arg);
int joinThread(pthread_t thread);

void ThreadManager_init();

#endif /* THREADMANAGER_H_ */




