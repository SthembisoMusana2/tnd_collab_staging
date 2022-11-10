#include <iostream>
#include <vector>
using namespace std;

inline void displayVector(vector<int> arr){
    for(auto it = arr.begin(); it!=arr.end(); it++){
        cout<<*it<<" ";
    }
    cout<<endl;
}
void towSum(vector<int> arr, int target)
{
    displayVector(arr);// function called to diplay the elements of our vectors
    //int i, j;
    int m = arr.size()/2;
    
    if(arr.size()>1){
        //If there's more than one element to the vector
        //then there might be still a solution
        if(arr.at(m-1) + arr.at(m) == target){
            cout<<"Solution:\n\t";
            cout<<arr.at(m-1)<<" + "<<arr.at(m)<<" = "<<target<<" (target)"<<endl;
        }
        /*Going left, deleting right-half
        if the sum of the two mid-elements is more than target*/
        else if(arr.at(m-1) + arr.at(m) > target){
            cout<<"\n"<<arr.at(m-1)<<" + "<<arr.at(m)<<" > "<<target<<" (target). Therefor new Vector/Elecments:"<<endl;
            
            arr.erase(arr.begin()+arr.size()/2, arr.end());    //removing the right half elements
            displayVector(arr);// function called to diplay the elements of our vectors
            towSum(arr,target);
        }
        /*Going right, deleting left-half
        if the sum of the two mid-elements is less than target*/
        else if(arr.at(m-1) + arr.at(m) < target){
            cout<<"\n"<<arr.at(m-1)<<" + "<<arr.at(m)<<" < "<<target<<" (target). Therefor new Vector/Elecments:"<<endl;

            arr.erase(arr.begin(),arr.begin()+arr.size()/2);    //removing the left half elements
            displayVector(arr);// function called to diplay the elements of our vectors
            towSum(arr,target);
        }
    }
}
void towSumSecondPhase(vector<int> arr, int target){

    int m = arr.size()/2-1;
    int n = m+1;
    int left = 0, right = 0;
    cout<<"\n/******SECOND PHASE*******/"<<endl;

    if(arr.at(m) + arr.at(n) < target){
        cout<<arr.at(m)<<" + "<<arr.at(n)<< " < "<<target;
        cout<<" means we'll first take the numbers on the left and add with the ones on the right"<<endl;
        left = 1;
        right=0;
    }
    else{
        cout<<arr.at(m)<<" + "<<arr.at(n)<< " > "<<target;
        cout<<" means we'll first take the numbers on the right and add with the ones on the left"<<endl;
        right = 1;
        left = 0;
    }

    for(int i=0; i<n; i++)
    {
        if( arr.at(i) + arr.at(arr.size()-1) < target)
        {
            cout<< arr.at(i)<<" Is not compitable \n";
        }  
    }
    

}

int main()
{
    vector<int> arr ;

    int target = 12;
    system("cls");

    for(int i=1; i<=10; i++){
        arr.push_back(i);
    }
    towSum(arr,target);
    towSumSecondPhase(arr,target);
    cout<<"done";
    getchar();
    return 0;
}
