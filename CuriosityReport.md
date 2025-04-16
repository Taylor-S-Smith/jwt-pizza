# Curiosity Report - Common Vulnerability Scoring System

  I was intrigued by the CVSS. Before I started to do research, I generated the following questions. Below are my findings:

## What is CVSS?

  CVSS is a standard way to compare the severity of vulnerabilities. It uses a variety of metrics to try to boil the complexity of communicating severity down into a simple 0-10 score, helping people to prioritize what to address.

## Who created it?

  It was developed by the National Infrastructure Advisory Council while they were working on a research project [1]. They then chose theForum of Incident Response and Security Teams to be the "custodians" of the system for future iterations [2]. I unfortunately couldn't find more details on the original research project that inspired it. 

## Has it developed over time?

  Yes! We are actually on version 4 of the system. When it initially released in 2005, it wasn't peer reviewed and work immediately began on a second version [1]. Each version generally included more granularity to the existing metrics, and new metrics to make the system more accurate [6]. For example, in version 2 they introduced Environmental metrics that aimed to modify the base score based on where the vulnerability exists and how the software is run, though the effectiveness of this has sometimes been called into question [4].

## How did it become the standard? Did it have to outcompete other standards?

  This is the question I found the least information on. It laid a good foundation and gained adoption from several large groups, such as the National Vulnerability Database [7]. I am assuming the lack of information means that it didn't face much strong competition on its rise.

## What are the shortcomings of the system, if any?

  In general, the system is considered reliable and useful [2]. However, there are still several criticisms. Some criticise the limited input allowed when calculating a score. This sometimes results in scores that are much different then what those working on the software would put. For example, due to its bias towards higher scores to any vulnerability concerning widely used network software, those working on the curl project have abandoned the system altogether in favor of their own internal scoring [4]. Some criticize the expertise of those assigning the scores. When a score isn't already given to a vulnerability, an Authorized Data Publisher will assign a score themselves. However, there is no guarantee that the ADP has expertise in the software they are rating, which has caused some vulnerabilities to have very incorrect severity scores [4]. Lastly, some criticize the complexity, which leads to misuse of the metrics [3].

## Sources:

1. https://en.wikipedia.org/wiki/Common_Vulnerability_Scoring_System
2. https://ieeexplore.ieee.org/document/7797152
3.https://www.softwaresecured.com/post/why-common-vulnerability-scoring-systems-suck#:~:text=As%20discussed%20earlier%20the%20major,static%20impact%20regardless%20of%20circumstance.
4. https://daniel.haxx.se/blog/2025/01/23/cvss-is-dead-to-us/
5. https://www.first.org/cvss/v1/
6. https://securityblueteam.medium.com/journey-through-time-exploring-the-evolution-of-cvss-over-the-years-870e34dfd0be
7. https://nvd.nist.gov/


