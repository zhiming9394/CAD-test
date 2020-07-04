import sys
from pyautocad import Autocad
from win32com import client
import math
import os
import psutil

# filepath = "E:\work\软件\软件\图档\8GBY112_C.dwg"
filepath = sys.argv[1]

def getAllPid():
    pid_dict={}
    pids = psutil.pids()
    for pid in pids:
        p = psutil.Process(pid)
        pid_dict[pid]=p.name()
    return pid_dict

# def kill(pid):
#     try:
#         kill_pid = os.kill(pid, signal.SIGABRT)
#         print '已杀死pid为%s的进程,　返回值是:%s' % (pid, kill_pid)
#     except Exception as e:
#         print '没有如此进程!!!'


if __name__ == "__main__":
    print (sys.argv)
    f = open("E:\\aa.txt", mode = 'a+')
    f.write(str(sys.argv))
    # wincad = client.Dispatch("AutoCAD.Application")
    cadWorker = Autocad(create_if_not_exists=True)
    print(filepath)
    cadWorker.Application.Documents.Open(filepath)
    # cadWorker.ActiveDocument.SaveAs("E:\work\软件\软件\图档\8GBY112_d.dwg", 60)

    # dic = getAllPid()
    # os.system("taskkill /F /IM acad.exe") 
          
