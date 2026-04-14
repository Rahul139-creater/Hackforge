export const PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'HashMap'],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Return the answer in any order.`,
    examples: [
      { input: '4\n2 7 11 15\n9', output: '0 1' },
      { input: '3\n3 2 4\n6', output: '1 2' },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    testCases: [
      { id: 1, input: '4\n2 7 11 15\n9', expectedOutput: '0 1', label: 'Basic case' },
      { id: 2, input: '3\n3 2 4\n6', expectedOutput: '1 2', label: 'Mid elements' },
      { id: 3, input: '2\n3 3\n6', expectedOutput: '0 1', label: 'Duplicate values' },
      { id: 4, input: '5\n1 2 3 4 5\n9', expectedOutput: '3 4', label: 'End elements' },
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        
        int[] result = twoSum(nums, target);
        System.out.println(result[0] + " " + result[1]);
    }
}`,
      python: `import sys

def two_sum(nums, target):
    # Write your solution here
    pass

def main():
    input_data = sys.stdin.read().split()
    idx = 0
    n = int(input_data[idx]); idx += 1
    nums = [int(input_data[idx + i]) for i in range(n)]; idx += n
    target = int(input_data[idx])
    
    result = two_sum(nums, target)
    print(result[0], result[1])

main()`,
      javascript: `const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', l => lines.push(l.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);
    const target = parseInt(lines[2]);
    
    function twoSum(nums, target) {
        // Write your solution here
    }
    
    const result = twoSum(nums, target);
    console.log(result[0] + ' ' + result[1]);
});`,
    },
  },
  {
    id: 'palindrome',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    tags: ['String', 'DP'],
    description: `Given a string s, return the longest palindromic substring in s.

A palindrome is a string that reads the same forwards and backwards.`,
    examples: [
      { input: 'babad', output: 'bab' },
      { input: 'cbbd', output: 'bb' },
    ],
    constraints: [
      '1 ≤ s.length ≤ 1000',
      's consists of only digits and English letters.',
    ],
    testCases: [
      { id: 1, input: 'babad', expectedOutput: 'bab', label: 'Basic palindrome' },
      { id: 2, input: 'cbbd', expectedOutput: 'bb', label: 'Even palindrome' },
      { id: 3, input: 'a', expectedOutput: 'a', label: 'Single char' },
      { id: 4, input: 'racecar', expectedOutput: 'racecar', label: 'Full palindrome' },
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static String longestPalindrome(String s) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(longestPalindrome(s));
    }
}`,
      python: `import sys

def longest_palindrome(s):
    # Write your solution here
    pass

s = sys.stdin.readline().strip()
print(longest_palindrome(s))`,
      javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    function longestPalindrome(s) {
        // Write your solution here
    }
    console.log(longestPalindrome(line.trim()));
    rl.close();
});`,
    },
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci with Memoization',
    difficulty: 'Easy',
    tags: ['Recursion', 'DP'],
    description: `Given a number n, compute the n-th Fibonacci number.

The Fibonacci sequence: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)

Your solution must be efficient — use memoization or dynamic programming.`,
    examples: [
      { input: '10', output: '55' },
      { input: '20', output: '6765' },
    ],
    constraints: [
      '0 ≤ n ≤ 50',
      'Result fits in a long integer.',
    ],
    testCases: [
      { id: 1, input: '10', expectedOutput: '55', label: 'F(10)' },
      { id: 2, input: '0', expectedOutput: '0', label: 'F(0) base case' },
      { id: 3, input: '1', expectedOutput: '1', label: 'F(1) base case' },
      { id: 4, input: '20', expectedOutput: '6765', label: 'F(20)' },
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    static Map<Long, Long> memo = new HashMap<>();
    
    public static long fib(long n) {
        // Write your solution here (use memoization!)
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println(fib(n));
    }
}`,
      python: `import sys
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    # Write your solution here
    pass

n = int(sys.stdin.readline().strip())
print(fib(n))`,
      javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const memo = {};
    function fib(n) {
        // Write your solution here (use memoization!)
    }
    console.log(fib(parseInt(line.trim())));
    rl.close();
});`,
    },
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    tags: ['Array', 'Binary Search'],
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: '6\n-1 0 3 5 9 12\n9', output: '4' },
      { input: '6\n-1 0 3 5 9 12\n2', output: '-1' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-10⁴ < nums[i], target < 10⁴',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    testCases: [
      { id: 1, input: '6\n-1 0 3 5 9 12\n9', expectedOutput: '4', label: 'Target found' },
      { id: 2, input: '6\n-1 0 3 5 9 12\n2', expectedOutput: '-1', label: 'Target not found' },
      { id: 3, input: '1\n5\n5', expectedOutput: '0', label: 'Single element' },
      { id: 4, input: '5\n1 3 5 7 9\n1', expectedOutput: '0', label: 'First element' },
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static int search(int[] nums, int target) {
        // Implement binary search here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        System.out.println(search(nums, target));
    }
}`,
      python: `import sys

def search(nums, target):
    # Implement binary search here
    pass

data = sys.stdin.read().split()
n = int(data[0])
nums = [int(data[i+1]) for i in range(n)]
target = int(data[n+1])
print(search(nums, target))`,
      javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', l => lines.push(l.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);
    const target = parseInt(lines[2]);
    
    function search(nums, target) {
        // Implement binary search here
    }
    
    console.log(search(nums, target));
});`,
    },
  },
];

export const LANGUAGE_CONFIG = {
  java: {
    id: 'java',
    label: 'Java',
    monacoLang: 'java',
    color: '#f89820',
    icon: '☕',
    extension: '.java',
  },
  python: {
    id: 'python',
    label: 'Python',
    monacoLang: 'python',
    color: '#3572A5',
    icon: '🐍',
    extension: '.py',
  },
  javascript: {
    id: 'javascript',
    label: 'JavaScript',
    monacoLang: 'javascript',
    color: '#f7df1e',
    icon: '⚡',
    extension: '.js',
  },
}